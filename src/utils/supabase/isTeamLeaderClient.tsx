import { createClient } from "@/utils/supabase/client";

export default async function isTeamLeaderClient() {
  let isLeader: { isLeader: boolean; teams: string[] } = {
    isLeader: false,
    teams: [],
  };

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.log("Not logged in:", userError.message);
    return isLeader;
  }

  if (user) {
    const { data: teamLeader, error: teamLeaderError } = await supabase
      .from("team-members")
      .select("*")
      .eq("profile", user.id)
      .eq("role", "leader");

    if (teamLeaderError) {
      console.log("Error fetching profile:", teamLeaderError.message);
      return isLeader;
    } else {
      if (teamLeader.length >= 1) {
        isLeader.isLeader = true;
        teamLeader.map((team) => {
          isLeader.teams.push(team.team_id);
        });
      }
    }
  }

  return isLeader;
}
