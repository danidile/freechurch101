"use server";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { songSchema } from "@/utils/types/types";

export const addSong = async (data: songSchema) => {
  console.log(data.id);
  const supabase = await createClient();
  const { error } = await supabase
    .from("italian-songs")
    .insert({
      song_title: data.song_title,
      author: data.author,
      lyrics: data.lyrics,
      upload_key: data.upload_key,
    })
    .select();

  // if (!songName || !author) {
  //   return { error: "Email and password are required" };
  // }
  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/songs",
      "Grazie per aver aggiunto la canzone!"
    );
  }
};
