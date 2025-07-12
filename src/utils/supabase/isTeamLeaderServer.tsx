import { createClient } from "@/utils/supabase/server";

export default async function isTeamLeaderServer() {
  let isLeader = {
    isLeader: false,
    teams: [""],
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
      .from("team-members")
      .select("*")
      .eq("profile", user.id)
      .eq("role", "leader");

    if (teamLeaderError) {
      console.error("Error fetching profile:", teamLeaderError.message);
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
