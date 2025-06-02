"use server";

import { createClient } from "@/utils/supabase/server";

export const getSongsCompact = async () => {
  const supabase = createClient();
  const { data: songs, error } = await supabase
    .from("songs")
    .select("id,song_title,author")
    .order("song_title", { ascending: true });

  if (error) {
    console.error("Errore durante il fetch:", error);
  }
  const sortedSongs = songs.sort((a, b) =>
    a.song_title.localeCompare(b.song_title)
  );
  return sortedSongs;
};
