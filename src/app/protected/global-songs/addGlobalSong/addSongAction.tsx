"use server";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { TsongSchema } from "@/utils/types/types";

export const addSong = async (data: TsongSchema) => {
  console.log(data.id);
  const supabase = createClient();
  const { error } = await supabase
    .from("global-songs")
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
