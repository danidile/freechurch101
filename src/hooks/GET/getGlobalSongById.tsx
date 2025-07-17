"use server";

import { createClient } from "@/utils/supabase/server";

export const getItalianSongById = async (songData: unknown) => {
  const supabase = await createClient();

  // Cerca nella tabella 'songs'
  const { data: song, error: songError } = await supabase
    .from("italian-songs")
    .select("*")
    .eq("id", songData);

  if (songError) {
    console.error("La canzone non è nella tabella italian-songs:", songError);
    return null;
  } else {
    return song[0];
  }
};
