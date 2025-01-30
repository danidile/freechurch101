"use server";

import { createClient } from "@/utils/supabase/server";

export const getSongsByArtist = async (artistId: unknown) => {
  const supabase = createClient();
  const { data: song, error: songError } = await supabase
    .from("songs")
    .select("*")
    .eq("artist", artistId);
  
    if (songError) {
      console.error("Errore nel recupero della canzone:", songError);
      return null;
    }
  
    if (song && song.length > 0) {
      return song; // Ritorna la canzone se trovata
    }
  
    // Cerca nella tabella 'global-songs'
    const { data: song2, error: globalSongError } = await supabase
      .from("global-songs")
      .select("*")
      .eq("artist", artistId);
  
    if (globalSongError) {
      console.error("Errore nel recupero della canzone globale:", globalSongError);
      return null;
    }
  
    return song2 || null;

};
