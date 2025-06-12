"use server";
import { createClient } from "@/utils/supabase/server";
import { LeaderT } from "@/utils/types/types";

export const saveNewLeadersAction = async (
  newLeaders: string[],
  teamId: string
) => {
  const supabase = createClient();
  let { data: preTeamLeader, error: errorTeamLeader } = await supabase
    .from("team-leaders")
    .select("*")
    .eq("team", teamId);

  if (errorTeamLeader) {
    console.error("Error fetching teamLeader:", errorTeamLeader);
  }

  const profilesInPre = preTeamLeader.map((leader) => leader.profile);
  const profilesToAdd = newLeaders.filter(
    (profile) => !profilesInPre.includes(profile)
  );
  // Create new objects to add (you'll need to define the team manually or pass it in)
  const newLeadersToInsert: LeaderT[] = profilesToAdd.map((profile) => ({
    profile,
    team: teamId,
  }));

  // Step 2: Find profiles that were removed (need to delete by id)
  const rowsToDelete: string[] = preTeamLeader
    .filter((leader) => !newLeaders.includes(leader.profile))
    .map((leader) => leader.id);

  console.log("✅ LEaders to insert", newLeadersToInsert);
  // console.error("🔥 Error upserting team members");
  console.log("❌ toDeleteIds", rowsToDelete);

  const { error: teamMemberUpdateSkills } = await supabase
    .from("team-leaders")
    .insert(newLeadersToInsert)
    .select();
  const { error } = await supabase
    .from("team-leaders")
    .delete()
    .in("id", rowsToDelete);
  if (teamMemberUpdateSkills) {
    console.error("Error updating Member skills:", teamMemberUpdateSkills);
  } else {
    console.log("updated team member skilld successfully");

    return "success";
  }
};
