"use server";
import { createClient } from "@/utils/supabase/server";
import { churchMembersT, LeaderT } from "@/utils/types/types";

export const removeLeadersAction = async (
  leadersToDelete: churchMembersT[],
  teamId: string
) => {
  const supabase = createClient();
  const leaderIdsToDelete = leadersToDelete.map((person) => person.profile);

  const { error } = await supabase
    .from("team-leaders")
    .delete()
    .in("profile", leaderIdsToDelete);
  if (error) {
    console.error("Error Deleting Leaders skills:", error);
  } else {
    console.log("Leaders Deleting successfully");

    return "success";
  }
};
