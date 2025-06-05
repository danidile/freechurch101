"use server";

import { createClient } from "@/utils/supabase/server";
import { churchMembersT, teamData } from "@/utils/types/types";

export const getTeamByIdFunction = async (teamId: string) => {
  const supabase = createClient();

  let { data: teamMembers, error: errorTeamMembers } = await supabase
    .from("team-members")
    .select("id, roles, profile(id,name, lastname, email)")
    .eq("team_id", teamId);
  if (errorTeamMembers) {
    console.error("Error fetching setlist:", errorTeamMembers);
    return null;
  }

  const formattedTeamMembers = await Promise.all(
    teamMembers.map(async (member) => {
      const profile = Array.isArray(member.profile)
        ? member.profile[0]
        : member.profile;

      const { data: blockouts, error: blockoutError } = await supabase
        .from("blockouts")
        .select("start, end")
        .eq("profile", profile.id);

      if (blockoutError) {
        console.error(
          `Error fetching blockouts for ${profile.id}`,
          blockoutError
        );
      }

      return {
        id: member.id,
        profile: profile.id,
        roles: member.roles,
        name: profile.name,
        lastname: profile.lastname,
        email: profile.email,
        isTemp: false,
        blockouts: blockouts || [],
      };
    })
  );
  return formattedTeamMembers;
};

export const getChurchTeam = async (teamId: string) => {
  const supabase = createClient();
  let { data: churchTeam, error } = await supabase
    .from("church-teams")
    .select("id,team_name,is_worship")
    .eq("id", teamId)
    .single();
  const formattedTeamMembers = await getTeamByIdFunction(teamId);
  const result: teamData = {
    id: teamId,
    team_name: churchTeam.team_name,
    team_members: formattedTeamMembers as churchMembersT[],
    selected: [] as churchMembersT[],
  };

  return result;
};
