"use server";

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";

export const removeMemberFromTeamAction = async (
  memberId: string,
  teamId: string
) => {
  const supabase = createClient();
  console.log(memberId);
  console.log(teamId);

  const { error: teamMemberDelete } = await supabase
    .from("team-members")
    .delete()
    .eq("profile", memberId)
    .eq("team_id", teamId);

  if (teamMemberDelete) {
    console.error("Error deleting Member from team:", teamMemberDelete);
  } else {
    console.log("Deleted member from team successfully");
    return "success";
  }
};
