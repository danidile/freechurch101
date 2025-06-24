"use server";

import { createClient } from "@/utils/supabase/server";

export const getItalianSongs = async () => {
  const supabase = createClient();

  const { data: italianSongs, error } = await supabase
    .from("italian-songs")
    .select("*")
    .order("song_title", { ascending: true });

  if (error) {
    console.error("Errore durante il fetch:", error);
  }

  const sortedSongs = italianSongs.sort((a, b) =>
    a.author.localeCompare(b.author)
  );

  return sortedSongs;
};
