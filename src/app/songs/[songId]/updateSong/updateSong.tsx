"use server";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";


export const updateSong = async (formData: FormData) => {
    const songName = formData.get("song-title")?.toString();
    const author = formData.get("author")?.toString();
    const lyrics = formData.get("lyrics")?.toString();
    const songId = formData.get("id")?.toString();
    console.log("Lyrics Are: " + songId);
    
    const supabase = createClient();  
    if (!songName || !author) {
      return { error: "Email and password are required" };
    }





    const { error } = await supabase
    .from('songs')
    .update({ lyrics: lyrics })
      .eq('id', songId)
    .select();
    
    if (error) {
      console.error(error.code + " " + error.message);
      return encodedRedirect("error", "/sign-up", error.message);
    } else {
      return encodedRedirect(
        "success",
        `/songs/${songId}`,
        "Thanks for signing up! Please check your email for a verification link.",
      );
    }
  };