"use server";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { songSchema } from "@/utils/types/types";
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";

export const addSong = async (data: songSchema) => {
  const supabase = createClient();
  const userData: basicUserData = await fbasicUserData();
  if (userData) {
    const { error } = await supabase
      .from("songs")
      .insert({
        song_title: data.song_title,
        author: data.author,
        lyrics: data.lyrics,
        upload_key: data.upload_key,
        church: userData.church_id,
      })
      .select();
    if (error) {
      console.error(error.code + " " + error.message);
      return encodedRedirect("error", "/songs", error.message);
    } else {
      return encodedRedirect(
        "success",
        "/songs",
        "Grazie per aver aggiunto la canzone!"
      );
    }
  }
};
