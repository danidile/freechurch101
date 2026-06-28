"use server";

import { createClient } from "@/utils/supabase/server";

export const getBlockoutsByUserId = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("auth_id", user?.id)
    .single();
  const { data: blockouts, error } = await supabase
    .from("blockouts")
    .select("id,profile,start,end")
    .eq("profile", profile.id)
    .order("start", { ascending: true });

  if (error) {
    console.error("Error fetching setlist:", error);
    return null;
  }
  return blockouts;
};
