"use server";
import userData from "@/app/actions";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";


export const addSong = async (formData: FormData) => {
    const churchName = formData.get("church-name")?.toString();
    const pastor = formData.get("pastor")?.toString();
    const address = formData.get("address")?.toString();
    const website = formData.get("website")?.toString();
    const igHandle = formData.get("ig-handle")?.toString();
    const supabase = createClient();  
    if (!churchName || !pastor) {
      return { error: "Email and password are required" };
    }
    const uData =  await userData();

    const { data, error } = await supabase
    .from('churches')
    .insert({ church_name: churchName,
      pastor: pastor,
      address: address,
      website: website,
      ig_handle: igHandle
    })
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


 