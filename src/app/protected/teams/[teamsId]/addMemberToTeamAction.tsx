"use server";

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";

export const addMemberToTeamAction = async (
  memberId: string,
  teamId: string
) => {
  const supabase = await createClient();
  console.log(memberId);
  console.log(teamId);

  const { error: teamMemberDelete } = await supabase
    .from("team-members")
    .insert([
      {
        team_id: teamId,
        profile: memberId,
      },
    ])
    .select();

  if (teamMemberDelete) {
    console.error("Error deleting Member from team:", teamMemberDelete);
  } else {
    console.log("Deleted member from team successfully");
    return "success";
  }
};
