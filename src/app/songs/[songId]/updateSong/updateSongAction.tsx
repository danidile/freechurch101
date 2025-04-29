"use server";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { songSchema } from "@/utils/types/types";

export const updateSong = async (data: songSchema) => {
  console.log("id is: " + data.id);

  const supabase = createClient();
  if (!data) {
    return { error: "Email and password are required" };
  }

  if (data.type === "song") {
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
    console.log("id is: " + data.id);

    if (error) {
      console.error(error.code + " " + error.message);
      return encodedRedirect("error", "/sign-up", error.message);
    } else {
      console.log("UPDATE SECCESSFULL");

      return encodedRedirect("success", `/songs/${data.id}`, ".");
    }
  }

  if (data.type === "global") {
    const { error } = await supabase
      .from("global-songs")
      .update({
        author: data.author,
        song_title: data.song_title,
        lyrics: data.lyrics,
        upload_key: data.upload_key,
      })
      .eq("id", data.id)
      .select();
    console.log("id is: " + data.id);

    if (error) {
      console.error(error.code + " " + error.message);
      return encodedRedirect("error", "/sign-up", error.message);
    } else {
      console.log("UPDATE SECCESSFULL");

      return encodedRedirect("success", `/songs/${data.id}`, ".");
    }
  }
};
