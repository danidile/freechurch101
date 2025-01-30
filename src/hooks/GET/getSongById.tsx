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
    console.error("Errore nel recupero della canzone:", songError);
    return null;
  }

  if (song && song.length > 0) {
    return song[0]; // Ritorna la canzone se trovata
  }

  // Cerca nella tabella 'global-songs'
  const { data: song2, error: globalSongError } = await supabase
    .from("global-songs")
    .select("*")
    .eq("id", songData);

  if (globalSongError) {
    console.error("Errore nel recupero della canzone globale:", globalSongError);
    return null;
  }

  return song2?.[0] || null;
};
