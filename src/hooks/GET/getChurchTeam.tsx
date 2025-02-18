"use server";

import { createClient } from "@/utils/supabase/server";
import { teamData } from "@/utils/types/types";

export const getChurchTeam = async (teamId: string) => {
  const supabase = createClient();
  let { data: churchTeam, error } = await supabase
    .from("church-teams")
    .select("id,team_name,is_worship")
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
      : member.profile;
    return {
      id:member.id,
      profile: profile.id,
      roles: member.roles,
      name: profile.name,
      lastname: profile.lastname,
      email: profile.email,
    };
  });
  const result: teamData = {
    id: teamId,
    team_name: churchTeam.team_name,
    team_members: formattedTeamMembers,
    is_worship: churchTeam.is_worship,
  };

  return result;
};
