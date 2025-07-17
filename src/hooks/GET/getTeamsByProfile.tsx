"use server";

import { createClient } from "@/utils/supabase/server";
import { profileT, profileTeamsT, TeamMemberRaw } from "@/utils/types/types";

export const getTeamsByProfile = async (profileId: string) => {
  const supabase = await createClient();
  let { data: teams, error } = await supabase
    .from("team-members")
    .select("team_id(team_name),roles")
    .eq("profile", profileId);
  if (error) {
    console.error("Error fetching setlist:", error);
    return null;
  }
  if (!teams) return [];

  const teamsData: profileTeamsT[] = (teams as any).map(
    (team: TeamMemberRaw) => ({
      team_name: team.team_id.team_name,
      roles: team.roles,
    })
  );
  return teamsData;
};
