import { createClient } from "@/utils/supabase/client";
import { teamData } from "@/utils/types/types";
import { getChurchTeams } from "./getChurchTeams";

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
  const teamFinal: teamData[] = await getChurchTeams(churchId);
  const { data, error: errorEventTeam } = await supabase
    .from("event-team")
    .select("id,member(id, name, lastname),team(team_name),roles,status")
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
            selected_roles: member.roles || null,
            status: member.status,
          });
        }
      });
    });
  }

  return teamFinal;
};
