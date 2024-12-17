"use server"
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";



export default async function logoutTest() {
    console.log("working till here");
    const supabase = createClient()
  
    await supabase.auth.signOut()
  
    redirect('/')
  }