"use server";

import { createClient } from "@/utils/supabase/server";

export const getSongsByShareCode = async (shareCode: string) => {
  const supabase = createClient();
  const { data: shareCodeChurch } = await supabase
    .from("church-share-code")
    .select("church")
    .eq("code", shareCode)
    .single();
  const { data: songs, error } = await supabase
    .from("songs")
    .select("*")
    .order("song_title", { ascending: true })
    .eq("church", shareCodeChurch.church);

  if (error) {
    console.error("Errore durante il fetch:", error);
  }

  return songs;
};
