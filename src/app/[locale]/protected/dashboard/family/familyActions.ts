// lib/supabase/familyActions.ts
import { createClient } from "@/utils/supabase/client";
export const supabase = createClient();

// ─── Types ────────────────────────────────────────────────────────────────────

export type FamilyRole = "head" | "spouse" | "child" | "other";

export interface Family {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
}

export interface ResolvedMember {
  id: string;
  family_id: string;
  role: FamilyRole;
  profile_id: string | null;
  name: string;
  lastname: string;
  email: string | null;
  phone: string | null;
  birthdate: string | null;
  avatar_url: string | null;
  has_account: boolean;
  created_at: string;
}

export interface FamilyWithMembers extends Family {
  members: ResolvedMember[];
}

export interface UnlinkedMemberInput {
  name: string;
  lastname: string;
  email?: string;
  phone?: string;
  birthdate?: string;
  role: FamilyRole;
}

export interface LinkedMemberInput {
  profile_id: string;
  role: FamilyRole;
}

export type AddMemberInput = UnlinkedMemberInput | LinkedMemberInput;

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function currentUserId(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

// The select string used everywhere we need member + profile data
const MEMBER_SELECT = `
  id, family_id, role, profile_id, created_at,
  name, lastname, email, phone, birthdate,
  profiles (
    name, lastname, email, phone, birthday, avatar_url
  )
`;

// Merge raw DB row into a clean ResolvedMember
function resolveMember(row: any): ResolvedMember {
  const p = row.profiles ?? {};
  return {
    id: row.id,
    family_id: row.family_id,
    role: row.role,
    profile_id: row.profile_id,
    created_at: row.created_at,
    name: p.name ?? row.name,
    lastname: p.lastname ?? row.lastname,
    email: p.email ?? row.email ?? null,
    phone: p.phone ?? row.phone ?? null,
    birthdate: p.birthday ?? row.birthdate ?? null,
    avatar_url: p.avatar_url ?? null,
    has_account: row.profile_id !== null,
  };
}

async function fetchMembersForFamily(
  familyId: string,
): Promise<ResolvedMember[]> {
  const { data, error } = await supabase
    .from("family_members")
    .select(MEMBER_SELECT)
    .eq("family_id", familyId)
    .order("created_at");
  if (error) throw error;
  return (data ?? []).map(resolveMember);
}

async function fetchMemberById(memberId: string): Promise<ResolvedMember> {
  const { data, error } = await supabase
    .from("family_members")
    .select(MEMBER_SELECT)
    .eq("id", memberId)
    .single();
  if (error) throw error;
  return resolveMember(data);
}

// ─── Read ─────────────────────────────────────────────────────────────────────

/**
 * Get the current user's family with all resolved members.
 * Returns null if they haven't created or joined one yet.
 */
export async function getMyFamily(): Promise<FamilyWithMembers | null> {
  const uid = await currentUserId();

  // Try as creator first
  const { data: owned, error: ownedErr } = await supabase
    .from("families")
    .select("*")
    .eq("created_by", uid)
    .maybeSingle();
  if (ownedErr) throw ownedErr;

  // Fall back: find family via membership
  let family = owned;
  if (!family) {
    const { data: memberRow, error: memberErr } = await supabase
      .from("family_members")
      .select("family_id")
      .eq("profile_id", uid)
      .maybeSingle();
    if (memberErr) throw memberErr;
    if (!memberRow) return null;

    const { data: joined, error: joinErr } = await supabase
      .from("families")
      .select("*")
      .eq("id", memberRow.family_id)
      .single();
    if (joinErr) throw joinErr;
    family = joined;
  }

  const members = await fetchMembersForFamily(family.id);
  return { ...family, members };
}

// ─── Create ───────────────────────────────────────────────────────────────────

/**
 * Create a new family. The current user is automatically added
 * as head, linked via their profile_id.
 */
export async function createFamily(
  familyName: string,
): Promise<FamilyWithMembers> {
  const uid = await currentUserId();

  const { data: family, error: familyErr } = await supabase
    .from("families")
    .insert({ name: familyName.trim(), created_by: uid })
    .select()
    .single();
  if (familyErr) throw familyErr;

  const { error: headErr } = await supabase
    .from("family_members")
    .insert({ family_id: family.id, profile_id: uid, role: "head" });
  if (headErr) throw headErr;

  const members = await fetchMembersForFamily(family.id);
  return { ...family, members };
}

// ─── Update ───────────────────────────────────────────────────────────────────

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

// ─── Members ──────────────────────────────────────────────────────────────────

/**
 * Add a member to a family.
 * - Linked:   { profile_id, role }
 * - Unlinked: { name, lastname, email?, phone?, birthdate?, role }
 */
export async function addFamilyMember(
  familyId: string,
  input: AddMemberInput,
): Promise<ResolvedMember> {
  const payload =
    "profile_id" in input
      ? { family_id: familyId, profile_id: input.profile_id, role: input.role }
      : { family_id: familyId, ...input };

  const { data, error } = await supabase
    .from("family_members")
    .insert(payload)
    .select("id")
    .single();
  if (error) throw error;

  return fetchMemberById(data.id);
}

/**
 * Update an unlinked member's details.
 * Safe: the .is("profile_id", null) guard prevents touching linked members.
 */
export async function updateUnlinkedMember(
  memberId: string,
  updates: Partial<UnlinkedMemberInput>,
): Promise<ResolvedMember> {
  const { error } = await supabase
    .from("family_members")
    .update(updates)
    .eq("id", memberId)
    .is("profile_id", null);
  if (error) throw error;

  return fetchMemberById(memberId);
}

/**
 * Update the role of any member (linked or not).
 */
export async function updateMemberRole(
  memberId: string,
  role: FamilyRole,
): Promise<void> {
  const { error } = await supabase
    .from("family_members")
    .update({ role })
    .eq("id", memberId);
  if (error) throw error;
}

/**
 * Remove a member from the family.
 */
export async function removeFamilyMember(memberId: string): Promise<void> {
  const { error } = await supabase
    .from("family_members")
    .delete()
    .eq("id", memberId);
  if (error) throw error;
}

/**
 * Search existing profiles to add as linked members.
 */
export async function searchProfiles(
  query: string,
): Promise<
  Array<{
    id: string;
    name: string;
    lastname: string;
    email: string;
    avatar_url: string | null;
  }>
> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, lastname, email, avatar_url")
    .or(
      `name.ilike.%${query}%,lastname.ilike.%${query}%,email.ilike.%${query}%`,
    )
    .limit(10);
  if (error) throw error;
  return data ?? [];
}
