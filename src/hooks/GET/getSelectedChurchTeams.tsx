import { createClient } from "@/utils/supabase/server";
import { churchMembersT, teamData } from "@/utils/types/types";

export const getSelectedChurchTeams = async (
  churchId?: string,
  setListId?: string
) => {
  const supabase = createClient();
  const { data: teams, error } = await supabase
    .from("church-teams")
    .select("id,team_name")
    .eq("church", churchId);

  if (error) {
    console.log("error", error);
    return null;
  }

  if (!teams) return null;

  // Use Promise.all to wait for all async operations
  const teamFinal: teamData[] = await Promise.all(
    teams.map(async (team) => {
      const { data: teamMembers, error: teamMembersError } = await supabase
        .from("team-members")
        .select("id, roles, profile:profile!inner(id,name, lastname, email)")
        .eq("team_id", team.id);

      if (teamMembersError) {
        console.log("teamMembersError", teamMembersError);
        return { ...team };
      }

      const formattedTeamMembers: churchMembersT[] = teamMembers?.map(
        (member) => {
          const profile = Array.isArray(member.profile)
            ? member.profile[0]
            : member.profile;
          return {
            profile: profile.id,
            roles: member.roles,
            name: profile.name,
            lastname: profile.lastname,
            email: profile.email,
          };
        }
      );

      return {
        id: team.id,
        team_name: team.team_name,
        team_members: formattedTeamMembers || [],
        selected: [] as churchMembersT[],
      };
    })
  );

  const { data, error: errorEventTeam } = await supabase
    .from("event-team")
    .select("id,member(id, name, lastname),team(team_name)")
    .eq("setlist", setListId);

  if (errorEventTeam) {
    console.log(errorEventTeam);
  } else {
    data.map((member: any) => {
      teamFinal.map((team) => {
        if (team.team_name === member.team.team_name) {
          team.selected.push({
            id: member.id,
            team_name: member.team.team_name,
            profile: member.member.id,
            name: member.member.name,
            lastname: member.member.lastname,
          });
        }
      });
    });
  }

  console.log("teamFinal -", teamFinal[0].selected);
  return teamFinal;
};
