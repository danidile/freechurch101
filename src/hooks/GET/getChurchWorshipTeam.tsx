"use server";

import { createClient } from "@/utils/supabase/server";

export const getChurchWorshipTeam = async (churchId: string) => {
  const supabase = createClient();
  const { data: teamId, error } = await supabase
    .from("church-teams")
    .select("id")
    .eq("church", churchId)
    .eq("is_worship", true)
    .single();

  if (error) {
    console.log("error");
    console.log(error);
  } else {
    console.log("teameId");
    console.log(teamId.id);
  }
  if (teamId) {
    const { data: teamMembers, error: teamMembersError } = await supabase
      .from("team-members")
      .select("id, roles, profile:profile!inner(id,name, lastname, email)")
      .eq("team_id", teamId.id);

    if (teamMembersError) {
      console.log("teamMembersError");
      console.log(teamMembersError);
    } else {
      console.log("teamMembers -");
      console.log(teamMembers);
    }

    const formattedTeamMembers = teamMembers?.map((member) => {
      const profile = Array.isArray(member.profile)
        ? member.profile[0]
        : member.profile;
      return {
        id: member.id,
        profile: profile.id,
        roles: member.roles,
        name: profile.name,
        lastname: profile.lastname,
        email: profile.email,
      };
    });
    return formattedTeamMembers;
  } else {
    return null;
  }
};
