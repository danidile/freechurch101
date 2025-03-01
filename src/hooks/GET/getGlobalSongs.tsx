"use server";

import { createClient } from "@/utils/supabase/server";

export const getGlobalSongs = async () => {
  const supabase = createClient();

  const { data: globalSongs, error } = await supabase
    .from("global-songs")
    .select("*")
    .order("song_title", { ascending: true });

  if (error) {
    console.error("Errore durante il fetch:", error);
  }

  const sortedSongs = globalSongs.sort((a, b) =>
    a.author.localeCompare(b.author)
  );

  return sortedSongs;
};
