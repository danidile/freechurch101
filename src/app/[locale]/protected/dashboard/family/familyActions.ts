import { roles } from "@/constants";
import { createClient } from "@/utils/supabase/client";

export const supabase = createClient();

// ─── Types ──────────────────────────────────────────────────────────────────

export type FamilyRole = "head" | "spouse" | "child" | "other";

export interface Family {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
}

export interface FamilyMember {
  id: string; // profiles.id
  family: string | null; // profiles.family (FK -> families.id)
  family_role: FamilyRole; // profiles.family_role
  auth_id: string | null; // profiles.auth_id (null = no login account)
  name: string;
  lastname: string;
  email: string | null;
  phone: string | null;
  birthday: string | null;
  avatar_url: string | null;
  has_account: boolean; // derived: auth_id !== null
}

// Back-compat alias (old name is still imported by the component).
export type ResolvedMember = FamilyMember;

export interface FamilyWithMembers extends Family {
  members: FamilyMember[];
  isOwner: boolean;
}

export interface UnlinkedMemberInput {
  name: string;
  lastname: string;
  email?: string;
  phone?: string;
  birthday?: string;
  role: FamilyRole;
}

export interface LinkedMemberInput {
  profile_id: string;
  role: FamilyRole;
}

export type AddMemberInput = UnlinkedMemberInput | LinkedMemberInput;

// ─── Helpers ────────────────────────────────────────────────────────────────

async function authUid(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

/** The logged-in user's own profile (the auth-linked one). */
async function getMyProfile() {
  const uid = await authUid();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, auth_id, family, family_role, church")
    .eq("auth_id", uid)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Profilo non trovato.");
  return data as {
    id: string;
    auth_id: string;
    family: string | null;
    family_role: FamilyRole | null;
    church: string;
  };
}

// Columns we read whenever we hydrate a member from `profiles`.
const MEMBER_FIELDS =
  "id, auth_id, family, family_role, name, lastname, email, phone, birthday, avatar_url";

function toMember(row: any): FamilyMember {
  return {
    id: row.id,
    family: row.family ?? null,
    family_role: row.family_role,
    auth_id: row.auth_id ?? null,
    name: row.name,
    lastname: row.lastname,
    email: row.email ?? null,
    phone: row.phone ?? null,
    birthday: row.birthday ?? null,
    avatar_url: row.avatar_url ?? null,
    has_account: row.auth_id != null,
  };
}

async function fetchFamilyMembers(familyId: string): Promise<FamilyMember[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select(MEMBER_FIELDS)
    .eq("family", familyId)
    .order("name");
  if (error) throw error;
  return (data ?? []).map(toMember);
}

// ─── Read ───────────────────────────────────────────────────────────────────

/**
 * Get the current user's family with all members.
 * Returns null if their profile isn't attached to a family yet.
 */
export async function getMyFamily(): Promise<FamilyWithMembers | null> {
  const me = await getMyProfile();
  if (!me.family) return null;

  const { data: family, error } = await supabase
    .from("families")
    .select("*")
    .eq("id", me.family)
    .single();
  if (error) throw error;

  const members = await fetchFamilyMembers(me.family);
  return {
    ...family,
    members,
    // Works whether created_by stores the auth uid or the profile id.
    isOwner: family.created_by === me.auth_id || family.created_by === me.id,
  };
}

// ─── Create ─────────────────────────────────────────────────────────────────

/**
 * Create a family. The current user becomes the head (their own profile is
 * attached to the new family).
 */
export async function createFamily(
  familyName: string,
): Promise<FamilyWithMembers> {
  const me = await getMyProfile();

  const { data: family, error: familyErr } = await supabase
    .from("families")
    .insert({
      name: familyName.trim(),
      created_by: me.id, // = auth.uid(); change to me.id if your RLS expects the profile id
    })
    .select()
    .single();
  if (familyErr) throw familyErr;

  const { error: linkErr } = await supabase
    .from("profiles")
    .update({ family: family.id, family_role: "head" })
    .eq("id", me.id);

  if (linkErr) {
    // Roll back so we don't leave an orphan family behind.
    await supabase.from("families").delete().eq("id", family.id);
    throw linkErr;
  }

  const members = await fetchFamilyMembers(family.id);
  return { ...family, members, isOwner: true };
}

// ─── Update family ──────────────────────────────────────────────────────────

export async function updateFamilyName(
  familyId: string,
  name: string,
): Promise<void> {
  const { error } = await supabase
    .from("families")
    .update({ name: name.trim() })
    .eq("id", familyId);
  if (error) throw error;
}

// ─── Members ────────────────────────────────────────────────────────────────

/**
 * Add a member to a family.
 *  - Linked   ({ profile_id, role }): attach an existing account holder.
 *  - Unlinked ({ name, lastname, …, role }): create a new account-less profile.
 */
export async function addFamilyMember(
  familyId: string,
  input: AddMemberInput,
): Promise<FamilyMember> {
  if ("profile_id" in input) {
    // Attach an existing profile. `.is("family", null)` refuses to steal
    // someone who already belongs to another family.
    const { data, error } = await supabase
      .from("profiles")
      .update({ family: familyId, family_role: input.role}) // default role for NOaccount holders
      .eq("id", input.profile_id)
      .is("family", null)
      .select(MEMBER_FIELDS)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new Error("Questa persona è già in una famiglia.");
    return toMember(data);
  }

  // Create a brand-new account-less profile in the same church.
  const me = await getMyProfile();
  const { data, error } = await supabase
    .from("profiles")
    .insert({
      family: familyId,
      family_role: input.role,
      name: input.name.trim(),
      lastname: input.lastname.trim(),
      email: input.email?.trim() || null,
      phone: input.phone?.trim() || null,
      birthday: input.birthday || null,
      church: me.church, // keep the new profile inside the same tenant
      auth_id: null, // no login account (yet)
      role: 80, // default role for account-less members
    })
    .select(MEMBER_FIELDS)
    .single();
  if (error) throw error;
  return toMember(data);
}

/**
 * Update an account-less member's details.
 * The `.is("auth_id", null)` guard makes it impossible to edit an account
 * holder's personal data from here.
 */
export async function updateUnlinkedMember(
  memberId: string,
  updates: Partial<UnlinkedMemberInput>,
): Promise<FamilyMember> {
  const patch: Record<string, any> = {};
  if (updates.name !== undefined) patch.name = updates.name.trim();
  if (updates.lastname !== undefined) patch.lastname = updates.lastname.trim();
  if (updates.email !== undefined) patch.email = updates.email?.trim() || null;
  if (updates.phone !== undefined) patch.phone = updates.phone?.trim() || null;
  if (updates.birthday !== undefined) patch.birthday = updates.birthday || null;
  if (updates.role !== undefined) patch.family_role = updates.role;

  const { data, error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", memberId)
    .is("auth_id", null)
    .select(MEMBER_FIELDS)
    .maybeSingle();
  if (error) throw error;
  if (!data)
    throw new Error("Impossibile modificare un membro con un account.");
  return toMember(data);
}

/** Change a member's family role (works for account holders too). */
export async function updateMemberRole(
  memberId: string,
  role: FamilyRole,
): Promise<FamilyMember> {
  const { data, error } = await supabase
    .from("profiles")
    .update({ family_role: role })
    .eq("id", memberId)
    .select(MEMBER_FIELDS)
    .single();
  if (error) throw error;
  return toMember(data);
}

/**
 * Remove a member from the family.
 *  - Account holder → just detach (family/role cleared, profile kept).
 *  - Account-less   → delete the profile (it only existed as a family member).
 *
 * Note: if account-less profiles can be referenced by other tables in your app
 * (teams, attendance, etc.), switch the delete branch to the same detach update
 * to avoid FK violations / data loss.
 */
export async function removeFamilyMember(
  memberId: string,
  hasAccount: boolean,
): Promise<void> {
  if (hasAccount) {
    const { error } = await supabase
      .from("profiles")
      .update({ family: null, family_role: null })
      .eq("id", memberId);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", memberId)
      .is("auth_id", null); // safety: never delete an account holder
    if (error) throw error;
  }
}

/**
 * Search existing account holders (not already in a family) to link.
 * Church scoping is handled by RLS on `profiles`.
 */
export async function searchProfiles(query: string): Promise<
  Array<{
    id: string;
    name: string;
    lastname: string;
    email: string | null;
    avatar_url: string | null;
  }>
> {
  const me = await getMyProfile();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, lastname, email, avatar_url")
    .is("family", null) // exclude anyone already in a family
    .or(
      `name.ilike.%${query}%,lastname.ilike.%${query}%,email.ilike.%${query}%`,
    )
    .eq("church", me.church)
    .limit(10);
  if (error) throw error;
  return data ?? [];
}
