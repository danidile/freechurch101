"use server";

import { createClient } from "@/utils/supabase/server";

export const getSongById = async (songData: unknown) => {
  const supabase = createClient();
  // Cerca nella tabella 'songs'
  const { data: song, error: songError } = await supabase
    .from("songs")
    .select("*")
    .eq("id", songData);

  if (!song) {
    const { data: globalSong, error: globalSongError } = await supabase
      .from("global-songs")
      .select("*")
      .eq("id", songData);

    if (globalSongError) {
      console.error(
        "La canzone non è ne nella tabella songs ne global-songs:",
        songError
      );
    } else {
      console.log("Canzone trovata!");

      return globalSong;
    }
  } else {
    return song[0];
  }
};
