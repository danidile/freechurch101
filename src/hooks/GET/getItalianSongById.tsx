"use server";

import { createClient } from "@/utils/supabase/server";

export const getItalianSongById = async (songData: unknown) => {
  const supabase = createClient();
  // Cerca nella tabella 'songs'
  const { data: song, error: songError } = await supabase
    .from("italian-songs")
    .select("*")
    .eq("id", songData)
    .single();

  return song;
};
