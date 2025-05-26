"use server";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { songSchema } from "@/utils/types/types";

export const addGlobalSong = async (data: songSchema) => {
  console.log(data.id);
  const supabase = createClient();
  const { error } = await supabase
    .from("global-songs")
    .insert({
      song_title: data.song_title,

      author: data.author,
      artist: data.artist,
      album: data.album,
      lyrics: data.lyrics,
      upload_key: data.upload_key,
      bpm: data.bpm,
    })
    .select();

  // if (!songName || !author) {
  //   return { error: "Email and password are required" };
  // }
  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("success", "/songs", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/protected/global-songs",
      "Canzone aggiunta con successo!"
    );
  }
};
