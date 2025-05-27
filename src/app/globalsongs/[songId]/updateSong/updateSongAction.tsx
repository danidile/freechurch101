"use server";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { songSchema } from "@/utils/types/types";

export const updateSong = async (data: songSchema) => {
  const supabase = createClient();

  const { error } = await supabase
    .from("songs")
    .update({
      author: data.author,
      song_title: data.song_title,
      lyrics: data.lyrics,
      upload_key: data.upload_key,
    })
    .eq("id", data.id)
    .select();
  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    console.log("UPDATE SECCESSFULL");
    return encodedRedirect("success", `/songs/${data.id}`, ".");
  }
};
