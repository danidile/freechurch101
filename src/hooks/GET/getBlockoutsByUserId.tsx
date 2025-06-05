"use server";

import { createClient } from "@/utils/supabase/server";

export const getBlockoutsByUserId = async (userId: string) => {
  const supabase = createClient();
  const { data: blockouts, error } = await supabase
    .from("blockouts")
    .select("id,profile,start,end")
    .eq("profile", userId)
    .order("start", { ascending: true });

  if (error) {
    console.error("Error fetching setlist:", error);
    return null;
  }
  return blockouts;
};
