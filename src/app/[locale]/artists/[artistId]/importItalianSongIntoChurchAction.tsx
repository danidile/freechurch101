"use server";

import { createClient } from "@/utils/supabase/server";
import { translateSupabaseError } from "@/utils/supabase/translateSupabaseError";
import { TlostPasswordSchema } from "@/utils/types/auth";
import {
  ServerActionResponse,
  songType,
  SongWithAlbum,
} from "@/utils/types/types";

const importItalianSongIntoChurchAction = async (
  song: SongWithAlbum
): Promise<ServerActionResponse<null>> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // GET profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();
  if (profile.church) {
    const church: string = profile.church;

    if (!song) {
      return {
        success: false,
        error: "Errore: Canzone richiesta.",
      };
    }
    const formattedSong: songType = {
      song_title: song.song_title,
      lyrics: song.lyrics,
      upload_key: song.upload_key,
      author: song.author,
      church: church,
      tags: song.tags || null,
      bpm: song.bpm || null,
    };
    const { data, error } = await supabase
      .from("songs")
      .insert(formattedSong)
      .select();
    if (error) {
      console.log(error);
      return {
        success: false,
        error: translateSupabaseError(error.message),
      };
    } else {
      console.log(error);
      return {
        success: true,
        message:
          "Controlla la lista della tua chiesa per trovare la nuova canzone aggiunta.",
      };
    }
  } else {
    return {
      success: false,
      message: "Devi appartenere ad una chiesa per poter importare le canzoni.",
    };
  }
};

export default importItalianSongIntoChurchAction;
