"use server";

import { createClient } from "@/utils/supabase/server";

export const getChurchMembersCompact = async (churchId: string) => {
  const supabase = await createClient();
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id,email,name, lastname")
    .eq("church", churchId);
  return profiles;
};
