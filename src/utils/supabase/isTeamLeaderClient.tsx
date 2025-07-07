import { createClient } from "@/utils/supabase/client";

export default async function isTeamLeaderClient() {
  let isLeader: { isLeader: boolean; teams: string[] } = {
    isLeader: false,
    teams: [],
  };

  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Not logged in:", userError.message);
    return isLeader;
  }

  if (user) {
    const { data: teamLeader, error: teamLeaderError } = await supabase
      .from("team-leaders")
      .select("*")
      .eq("profile", user.id);

    if (teamLeaderError) {
      console.error("Error fetching profile:", teamLeaderError.message);
      return isLeader;
    } else {
      if (teamLeader.length >= 1) {
        isLeader.isLeader = true;
        teamLeader.map((team) => {
          isLeader.teams.push(team.team);
        });
      }
    }
  }

  return isLeader;
}
