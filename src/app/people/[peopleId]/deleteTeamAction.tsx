"use server";

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";

export const deleteTeamAction = async (teamId: string) => {
  const supabase = createClient();
  console.log(teamId);
  // const { error: setlistError } = await supabase
  //   .from("team-members")
  //   .delete()
  //   .eq("team_id", teamId);
  const { error: setlistSongsError } = await supabase
    .from("church-teams")
    .delete()
    .eq("id", teamId);

  if (setlistSongsError ) {
    console.error("Error deleting rows:", setlistSongsError );
  } else {
    console.log("Rows deleted successfully");
    // return encodedRedirect(
    //   "success",
    //   "/setlist",
    //   "SetList eliminata con successo!"
    // );
  }
};
