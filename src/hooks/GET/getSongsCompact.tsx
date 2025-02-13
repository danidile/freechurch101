"use server";

import { createClient } from "@/utils/supabase/server";

export const getSongsCompact = async () => {
  const supabase = createClient();
  const { data: customSongs, error } = await supabase
    .from("songs")
    .select("id,song_title,author")
    .order("song_title", { ascending: true });

  const { data: globalSongs, error: error2 } = await supabase
    .from("global-songs")
    .select("id,song_title,author")
    .order("song_title", { ascending: true });

  if (error || error2) {
    console.error("Errore durante il fetch:", error);
  }
  if (customSongs && globalSongs) {
    // Add a 'source' field to each song indicating the table it came from
    const customSongsWithSource = customSongs.map(song => ({
      ...song,
      type: "songs",  // Mark songs from the 'songs' table
    }));

    const globalSongsWithSource = globalSongs.map(song => ({
      ...song,
      type: "global-songs",  // Mark songs from the 'global-songs' table
    }));

    // Combine both lists
    const allSongs = [...customSongsWithSource, ...globalSongsWithSource];

    // Sort the songs by song title
    const sortedSongs = allSongs.sort((a, b) =>
      a.song_title.localeCompare(b.song_title)
    );
    return sortedSongs;
  }
};
