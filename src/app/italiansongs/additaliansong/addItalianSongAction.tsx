"use server";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { songSchema } from "@/utils/types/types";

export const addItalianSong = async (data: songSchema) => {
  console.log(data.id);
  const supabase = createClient();
  const {data:response, error } = await supabase
    .from("italian-songs")
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
    return encodedRedirect("success", "/italiansongs", error.message);
  } else {
    return encodedRedirect(
      "success",
      `/italiansongs/${response && response[0]?.id}`,
      "Canzone aggiunta con successo!"
    );
  }
};
