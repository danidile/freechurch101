"use server";

import { createClient } from "@/utils/supabase/server";
import { churchMembersT, teamData } from "@/utils/types/types";
import { getTeamByIdFunction } from "./getChurchTeam";

export const getChurchTeams = async (churchId: string) => {
  const supabase = await createClient();
  const { data: teams, error } = await supabase
    .from("church-teams")
    .select("id,team_name,is_worship")
    .eq("church", churchId);

  if (error) {
    console.log("error", error);
    return null;
  }

  if (!teams) return null;

  // Use Promise.all to wait for all async operations
  const teamFinal: teamData[] = await Promise.all(
    teams.map(async (team) => {
      const teamMembers = await getTeamByIdFunction(team.id);
      return {
        id: team.id,
        team_name: team.team_name,
        team_members: teamMembers ?? [], // Assicura un array vuoto se `null`
        selected: [] as churchMembersT[],
        is_worship: team.is_worship || false, // Default to false if not provided
      };
    })
  );

  return teamFinal;
};
