"use server";

import { createClient } from "@/utils/supabase/server";

export const getProfilesById = async (churchId: unknown) => {
  const supabase = createClient();
  const { data: profiles } = await supabase
  .from('profiles')
  .select("*")
  .eq('church', churchId);
    return profiles;
  };

