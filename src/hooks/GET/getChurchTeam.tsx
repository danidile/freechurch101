"use server";

import { createClient } from "@/utils/supabase/server";
import { churchMembersT, teamData } from "@/utils/types/types";
const rolePriority = {
  leader: 3,
  editor: 2,
  member: 1,
};
export const getTeamByIdFunction = async (teamId: string) => {
  const supabase = await createClient();
  let { data: teamLeader, error: errorTeamLeader } = await supabase
    .from("team-leaders")
    .select("*")
    .eq("team", teamId);

  if (errorTeamLeader) {
    console.error("Error fetching teamLeader:", errorTeamLeader);
  }
  const leaderProfileIds = (teamLeader || []).map((leader) => leader.profile);

  let { data: teamMembers, error: errorTeamMembers } = await supabase
    .from("team-members")
    .select("id, roles, profile(id,name, lastname, email),role")
    .eq("team_id", teamId);
  if (errorTeamMembers) {
    console.error("Error fetching teamMembers:", errorTeamMembers);
    return null;
  }
  const formattedTeamMembers = (
    await Promise.all(
      teamMembers.map(async (member) => {
        const profile = Array.isArray(member.profile)
          ? member.profile[0]
          : member.profile;

        const { data: blockouts, error: blockoutError } = await supabase
          .from("blockouts")
          .select("start, end")
          .eq("profile", profile?.id);

        if (blockoutError) {
          console.error(
            `Error fetching blockouts for ${profile.id}`,
            blockoutError
          );
        }

        return {
          id: member.id,
          profile: profile.id,
          roles: member.roles || [],
          name: profile.name,
          lastname: profile.lastname,
          email: profile.email,
          blockouts: blockouts || [],
          isLeader: leaderProfileIds.includes(profile.id),
          role: member.role,
        };
      })
    )
  ).sort(
    (a, b) =>
      (rolePriority[b.role as keyof typeof rolePriority] || 0) -
      (rolePriority[a.role as keyof typeof rolePriority] || 0)
  );

  return formattedTeamMembers;
};

export const getChurchTeam = async (teamId: string) => {
  const supabase = await createClient();
  let { data: churchTeam, error } = await supabase
    .from("church-teams")
    .select("id,team_name,is_worship")
    .eq("id", teamId)
    .single();

  if (error) {
    console.error("Error fetching church-team:", error);
    return null;
  }
  const formattedTeamMembers = await getTeamByIdFunction(teamId);
  const result: teamData = {
    id: teamId,
    is_worship: churchTeam.is_worship,
    team_name: churchTeam.team_name,
    team_members: formattedTeamMembers as churchMembersT[],
    selected: [] as churchMembersT[],
  };

  return result;
};
