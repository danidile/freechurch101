"use server";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { TsignUpSchema } from "@/utils/types/types";


export const addSong = async (data: TsignUpSchema) => {
    console.log("jfjer");
    const supabase = createClient();  
    const { error } = await supabase
      .from('songs')
      .insert({ song_title: data.songtitle,
        author: data.author,
        lyrics: data.author,
        upload_key: data.key })
      .select();
    
    // if (!songName || !author) {
    //   return { error: "Email and password are required" };
    // }
   
    
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


 