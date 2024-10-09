"use server";

import { createClient } from "@/utils/supabase/server";

export const getSong = async (songData: unknown) => {
  const supabase = createClient();
  const { data: song } = await supabase
  .from('songs')
  .select("*")
  .eq('id', songData);
  
  
    return song![0];
  };

