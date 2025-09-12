"use server";

import { createClient } from "@/utils/supabase/server";
import { teamData } from "@/utils/types/types";

export const getSelectedChurchTeams = async (
  churchId?: string,
  setListId?: string
) => {
  const supabase = await createClient();

  const teamFinal: teamData[] = [];
  console.time(".from(event-team)");
  const { data, error: errorEventTeam } = await supabase
    .from("event-team")
    .select(
      "id, member(id, name, lastname), team(id, team_name), roles, status, lead"
    )
    .eq("setlist", setListId);
  console.timeEnd(".from(event-team)");

  if (errorEventTeam) {
    console.error("errorEventTeam", errorEventTeam);
    return [];
  }

  if (!data) return [];

  data.forEach((member: any) => {
    // find team in the accumulator
    let team = teamFinal.find((t) => t.id === member.team.id);

    if (!team) {
      // if team not found, create it
      team = {
        id: member.team.id,
        team_name: member.team.team_name,
        selected: [],
      };
      teamFinal.push(team);
    }

    // push this member into the team's selected array
    team.selected!.push({
      id: member.id,
      team_name: member.team.team_name,
      profile: member.member.id,
      name: member.member.name,
      lastname: member.member.lastname,
      selected_roles: member.roles || null,
      status: member.status,
      lead: !!member.lead, // force boolean
    });
  });

  console.log("teamFinal", teamFinal);
  return teamFinal;
};
