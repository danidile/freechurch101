"use server";

import { createClient } from "@/utils/supabase/server";

export const getProfileById = async (profileId: string) => {
  const supabase = createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .single();
  return profile;
};
