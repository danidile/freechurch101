"use server";

import { createClient } from "@/utils/supabase/server";

export const getBlockoutsByUserId = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: blockouts, error } = await supabase
    .from("blockouts")
    .select("id,profile,start,end")
    .eq("profile", user.id)
    .order("start", { ascending: true });

  if (error) {
    console.error("Error fetching setlist:", error);
    return null;
  }
  return blockouts;
};
