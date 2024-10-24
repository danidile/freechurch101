"use server"
import { createClient } from "@/utils/supabase/server";
import { redirect } from 'next/navigation'


export default async function isLoggedIn() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if(user){
      return true;
    } else{
      return false;
    }
  }
  
  