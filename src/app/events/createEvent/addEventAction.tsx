"use server";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";


export const addEvent = async (formData: FormData) => {

    const songName = formData.get("song-title")?.toString();
    const author = formData.get("author")?.toString();
    const key = formData.get("key")?.toString();
    const lyrics = formData.get("lyrics")?.toString();
    const supabase = createClient();
    console.log(formData);  
    if (!songName || !author) {
      return { error: "Email and password are required" };
    }
    const { error } = await supabase
    .from('events')
    .insert({ song_title: songName,
      lyrics: lyrics,
      author: author,
      upload_key: key })
    .select()
        
    
    if (error) {
      console.error(error.code + " " + error.message);
      return encodedRedirect("error", "/sign-up", error.message);
    } else {
      return encodedRedirect(
        "success",
        "/sign-up",
        "Thanks for signing up! Please check your email for a verification link.",
      );
    }
  };


 