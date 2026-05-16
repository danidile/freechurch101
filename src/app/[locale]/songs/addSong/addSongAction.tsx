"use server";

import { createClient } from "@/utils/supabase/server";
import { songSchema } from "@/utils/types/types";
import { logEvent } from "@/utils/supabase/log"; // correct path

export const addSong = async (data: songSchema) => {
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

  const church: string = profile?.church;

  if (profile) {
    const { data: songData, error } = await supabase
      .from("songs")
      .insert({
        song_title: data.song_title,
        author: data.author,
        lyrics: data.lyrics,
        upload_key: data.upload_key,
        bpm: data.bpm,
        tags: data.tags,
        church: church,
        time_signature: data.time_signature,
        is_chordpro: data.is_chordpro,
      })
      .select()
      .single();

    if (error) {
      console.error(error.code + " " + error.message);

      await logEvent({
        event: "add_song_error",
        level: "error",
        user_id: user?.id || null,
        meta: {
          message: error.message,
          code: error.code,
          church: church,
          song_title: data.song_title,
        },
      });

      return { success: false, message: error.message };
    } else {
      return { success: true, songId: songData.id };
    }
  } else {
    await logEvent({
      event: "add_song_error",
      level: "error",
      user_id: user?.id || null,
      meta: {
        message: "Profilo non trovato.",
      },
    });

    return { success: false, message: "utente non trovato" };
  }
};
