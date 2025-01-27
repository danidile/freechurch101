"use server";

import { createClient } from "@/utils/supabase/server";

export const getSongsByArtist = async (artistId: unknown) => {
  const supabase = createClient();
  const { data: songs } = await supabase
    .from("songs")
    .select("*")
    .eq("artist", artistId);
  return songs;
};
