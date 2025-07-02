"use server";
import { createClient } from "@/utils/supabase/server";
import { newMember } from "@/utils/types/types";

type newMemberWithError = newMember & { error?: string };

const checkInvitesAction = async (
  formattedNewMembers: newMemberWithError[],
  churchId: string
): Promise<newMemberWithError[]> => {
  const supabase = createClient();

  const results = await Promise.all(
    formattedNewMembers.map(async (member): Promise<newMemberWithError> => {
      // Skip checks if already has an error
      if (member.error) return member;

      // Check if email already exists in profiles
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", member.email)
        .maybeSingle();

      if (profileError) {
        console.error("Check error (profiles):", profileError.message);
        return { ...member, error: "Failed to check profiles" };
      }

      if (profile) {
        return {
          ...member,
          error: `Questa Email ha già un profilo registrato.`,
        };
      }
      // Check if email already exists in pending_invites
      const { data: pending, error: pendingError } = await supabase
        .from("pending_invites")
        .select("id")
        .eq("email", member.email)
        .eq("church", churchId)
        .maybeSingle();

      if (pendingError) {
        console.error("Check error (pending_invites):", pendingError.message);
        return { ...member, error: "Failed to check pending_invites" };
      }

      if (pending) {
        return { ...member, error: "Questa Email ha già ricevuto un invito." };
      }

      // If no duplicates, return member unchanged
      return member;
    })
  );

  return results;
};

export default checkInvitesAction;
