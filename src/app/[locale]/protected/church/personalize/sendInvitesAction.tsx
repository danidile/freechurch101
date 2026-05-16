"use server";
import { createClient } from "@/utils/supabase/server";
import { newMember } from "@/utils/types/types";
import sendInviteEmail from "./sendInviteEmail";

const sendInvitesAction = async (formattedNewMembers: newMember[]) => {
  const supabase = await createClient();

  const results = await Promise.all(
    formattedNewMembers.map(async (newMember) => {
      const { data: existing, error: checkError } = await supabase
        .from("pending_invites")
        .select("id")
        .eq("email", newMember.email)
        .maybeSingle();

      if (checkError) {
        console.error("Check error:", checkError.message);
        return null;
      }

      if (existing) {
        console.log("Email already exists:", newMember.email);
        return null;
      }

      const { error: insertError } = await supabase
        .from("pending_invites")
        .insert(newMember);

      if (insertError) {
        console.error("Insert error:", insertError.message);
        return null;
      }

      console.log("Inserted:", newMember.email);
      return newMember;
    })
  );

  // Filter out nulls (failed or duplicate inserts)
  const invitesValid = results.filter((r): r is newMember => r !== null);
  return invitesValid;
};

export default sendInvitesAction;
