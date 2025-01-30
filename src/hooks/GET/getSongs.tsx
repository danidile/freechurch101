"use server";

import { createClient } from "@/utils/supabase/server";

export const getSongs = async () => {
  const supabase = createClient();
  const { data: songs, error } = await supabase
      .from("songs")
      .select("*")
      .order("song_title", { ascending: true });
  const { data: songsGlobal, error: error2 } = await supabase
      .from("global-songs")
      .select("*")
      .order("song_title", { ascending: true });


    if (error || error2) {
      console.error("Errore durante il fetch:", error);
    }
    if (songs && songsGlobal) {
      const merge = songs.concat(songsGlobal);
      const sortedSongs = merge.sort((a, b) => a.song_title.localeCompare(b.song_title));

      return sortedSongs;
    }
  
}

