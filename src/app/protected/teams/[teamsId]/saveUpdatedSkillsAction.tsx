"use server";

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";

export const saveUpdatedSkillsAction = async (
  memberId: string,
  newSkills: string[],
  teamId: string
) => {
  const supabase = await createClient();
  console.log("memberId", memberId);
  console.log("newSkills", newSkills);
  console.log("teamId", teamId);

  const { error: teamMemberUpdateSkills } = await supabase
    .from("team-members")
    .update([
      {
        roles: newSkills,
      },
    ])
    .eq("team_id", teamId)
    .eq("profile", memberId);
  if (teamMemberUpdateSkills) {
    console.error("Error updating Member skills:", teamMemberUpdateSkills);
  } else {
    console.log("updated team member skilld successfully");
    return "success";
  }
};
