"use server";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { songSchema } from "@/utils/types/types";

export const updateItalianSongAction = async (data: songSchema) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("italian-songs")
    .update({
      song_title: data.song_title,
      author: data.author,
      artist: data.artist,
      album: data.album,
      lyrics: data.lyrics,
      upload_key: data.upload_key,
      bpm: data.bpm,
    })
    .eq("id", data.id)
    .select();
  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/", error.message);
  } else {
    console.log("UPDATE SECCESSFULL");
    return encodedRedirect("success", `/italiansongs/${data.id}`, ".");
  }
};
