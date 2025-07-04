"use server";
import { createClient } from "@/utils/supabase/server";
import { churchMembersT, LeaderT } from "@/utils/types/types";

export const addNewLeadersAction = async (
  newLeaders: churchMembersT[],
  teamId: string
) => {
  const supabase = createClient();
  const newLeadersToInsert = newLeaders.map((member) => {
    return {
      team: teamId,
      profile: member.profile,
    };
  });
  const { error: teamMemberUpdateSkills } = await supabase
    .from("team-leaders")
    .insert(newLeadersToInsert)
    .select();
  if (teamMemberUpdateSkills) {
    console.log(teamMemberUpdateSkills.message);
  } else {
    console.log("new leaderrs added");
  }
};
