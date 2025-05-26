"use server";

import { createClient } from "@/utils/supabase/server";

export const getSongById = async (songData: unknown) => {
  const supabase = createClient();

  // Cerca nella tabella 'songs'
  const { data: song, error: songError } = await supabase
    .from("songs")
    .select("*")
    .eq("id", songData);

  if (songError) {
    console.error("La canzone non è nella tabella songs:", songError);
    return null;
  } else {
    return song[0];
  }
};
