"use server";

import { createClient } from "@/utils/supabase/server";

export const getGlobalSongById = async (songData: unknown) => {
  const supabase = createClient();

  // Cerca nella tabella 'songs'
  const { data: song, error: songError } = await supabase
    .from("global-songs")
    .select("*")
    .eq("id", songData);

  if (songError) {
    console.error("La canzone non è nella tabella songs:", songError);
    return null;
  } else {
    return song[0];
  }
};
