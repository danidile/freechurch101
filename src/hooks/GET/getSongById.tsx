"use server";

import { createClient } from "@/utils/supabase/server";

export const getSongById = async (songData: unknown) => {
  const supabase = await createClient();
  // Cerca nella tabella 'songs'
  const { data: song, error: songError } = await supabase
    .from("songs")
    .select("*")
    .eq("id", songData)
    .single();

  return song;
};
