"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { songSchema } from "@/utils/types/types";
import { logEvent } from "@/utils/supabase/log"; // correct import

export const updateSong = async (data: songSchema) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("songs")
    .update({
      author: data.author,
      song_title: data.song_title,
      lyrics: data.lyrics,
      upload_key: data.upload_key,
      bpm: data.bpm,
      tags: data.tags,
    })
    .eq("id", data.id)
    .select();

  if (error) {
    console.error(error.code + " " + error.message);

    await logEvent({
      event: "update_song_error",
      level: "error",
      meta: {
        message: error.message,
        code: error.code,
        song_id: data.id,
        
        song_title: data.song_title,
      },
    });

    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    console.log("UPDATE SUCCESSFUL");

    return encodedRedirect("success", `/songs/${data.id}`, ".");
  }
};
