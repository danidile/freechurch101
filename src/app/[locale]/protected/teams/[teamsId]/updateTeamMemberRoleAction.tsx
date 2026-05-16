"use server";
import { createClient } from "@/utils/supabase/server";
import { churchMembersT, LeaderT, TeamMember } from "@/utils/types/types";

export const updateTeamMemberRoleAction = async (
  userToUpdate: churchMembersT[],
  teamId: string
) => {
  const supabase = await createClient();
  userToUpdate.map(async (user) => {
    const { error: teamMemberUpdateRoleError } = await supabase
      .from("team-members")
      .update({ role: user.role })
      .eq("profile", user.profile)
      .eq("team_id", teamId)
      .select();
    if (teamMemberUpdateRoleError) {
      console.error("Error updating Member Role:", teamMemberUpdateRoleError);
    }
  });

  console.log("updated team member skilld successfully");

  return "success";
};
