"use server";

import { createClient } from "@/utils/supabase/server";
import { teamData } from "@/utils/types/types";

export const getChurchTeam = async (teamId: string) => {
  const supabase = createClient();
  let { data: churchTeam, error } = await supabase
    .from("church-teams")
    .select("id,team_name")
    .eq("id", teamId)
    .single();
  let { data: teamMembers, error: errorTeamMembers } = await supabase
    .from("team-members")
    .select("id, roles, profile:profile!inner(id,name, lastname, email)")
    .eq("team_id", teamId);
  if (error) {
    console.error("Error fetching setlist:", error);
    return null;
  }

  const formattedTeamMembers = teamMembers?.map((member) => {
    const profile = Array.isArray(member.profile)
    ? member.profile[0]
    : member.profile
    return {
      profile: member.id,
      roles: member.roles,
      name: profile.name,
      lastname:profile.lastname,
      email:profile.email,
      
    };
  });

  console.log("teamMembers");
  console.log(teamMembers);
  const result: teamData = {
    id: teamId,
    team_name: churchTeam.team_name,
    team_members: formattedTeamMembers,
  };

  return result;
};
