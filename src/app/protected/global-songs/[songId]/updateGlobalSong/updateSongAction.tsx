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

    const { error } = await supabase
    .from('songs')
    .update({ lyrics: data.lyrics })
      .eq('id',  data.id)
    .select();
    
    if (error) {
      console.error(error.code + " " + error.message);
      return encodedRedirect("error", "/sign-up", error.message);
    } else {
      return encodedRedirect(
        "success",
        `/songs/${data.id}`,
        "Thanks for signing up! Please check your email for a verification link.",
      );
    }
  };
