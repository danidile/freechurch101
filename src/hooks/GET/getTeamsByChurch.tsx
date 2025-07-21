"use server";

import { createClient } from "@/utils/supabase/server";

type TeamRow = {
  id: string;
  team_name: string;
};

type TeamMemberRow = {
  team_id: string;
  role: "leader" | "editor" | "member";
  profile: {
    name: string;
    lastname: string;
  } | null;
};

type TeamWithDetails = {
  id: string;
  team_name: string;
  member_count: number;
  leaders: string[];
};

export const getTeamsByChurch = async (
  churchId: string
): Promise<TeamWithDetails[] | null> => {
  const supabase = await createClient();

  // 1. Get all teams for this church
  const { data: teams, error: teamError } = await supabase
    .from("church-teams")
    .select("id, team_name")
    .eq("church", churchId);

  if (teamError || !teams) {
    console.error("Error fetching teams:", teamError);
    return null;
  }

  const typedTeams = teams as TeamRow[];
  const teamIds = typedTeams.map((team) => team.id);
  if (teamIds.length === 0) return [];

  // 2. Get all members in those teams
  const { data: members, error: memberError } = await supabase
    .from("team-members")
    .select("team_id, role, profile(name, lastname)")
    .in("team_id", teamIds);

  if (memberError || !members) {
    console.error("Error fetching team members:", memberError);
    return null;
  }

  const typedMembers = members as unknown as TeamMemberRow[];

  // 3. Combine data
  const result: TeamWithDetails[] = typedTeams.map((team) => {
    const teamMembers = typedMembers.filter((m) => m.team_id === team.id);
    const leaders = teamMembers
      .filter((m) => m.role === "leader" && m.profile)
      .map((m) => `${m.profile!.name} ${m.profile!.lastname}`);

    return {
      id: team.id,
      team_name: team.team_name,
      member_count: teamMembers.length,
      leaders,
    };
  });

  return result;
};
