"use server";

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";

export const deleteSong = async (song: string) => {
  const supabase = await createClient();
  console.log("delete song: ", song);
  const { error: SongError } = await supabase
    .from("songs")
    .delete()
    .eq("id", song);

  if (SongError) {
    console.error("Error deleting rows:", SongError);
  } else {
    console.log("song deleted successfully");
    return encodedRedirect(
      "success",
      "/songs",
      "canzone eliminata con successo!"
    );
  }
};
