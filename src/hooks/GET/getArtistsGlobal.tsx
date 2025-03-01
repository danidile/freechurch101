"use server";

import { createClient } from "@/utils/supabase/server";

export const getArtistsGlobal = async () => {
  const supabase = createClient();

  const { data: globalSongs, error } = await supabase
    .from("artists")
    .select("*")
    .order("artist_name", { ascending: true });

  if (error) {
    console.error("Errore durante il fetch:", error);
  }

  const sortedSongs = globalSongs.sort((a, b) =>
    a.author.localeCompare(b.author)
  );

  return sortedSongs;
};
