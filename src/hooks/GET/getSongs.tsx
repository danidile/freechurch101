"use server";

import { createClient } from "@/utils/supabase/server";

export const getSongs = async () => {
  const supabase = createClient();
  const { data: customSongs, error } = await supabase
    .from("songs")
    .select("*")
    .order("song_title", { ascending: true });

  const { data: globalSongs, error: error2 } = await supabase
    .from("global-songs")
    .select("*")
    .order("song_title", { ascending: true });

  if (error || error2) {
    console.error("Errore durante il fetch:", error);
  }
  if (customSongs && globalSongs) {


    // Unisci le due liste
    const allSongs = [...customSongs, ...globalSongs];

    const sortedSongs = allSongs.sort((a, b) =>
      a.song_title.localeCompare(b.song_title)
    );

    return sortedSongs;
  }
};
