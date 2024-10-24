"use server"
import { createClient } from "@/utils/supabase/server";


export default async function isLoggedIn() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if(user){
      return true;
    } else{
      return false;
    }
  }
  
  