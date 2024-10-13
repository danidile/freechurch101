"use server";

import { createClient } from "@/utils/supabase/server";

export const getSong = async (songData: any) => {
  const supabase = createClient();
  let { data: song, error } = await supabase
  .from('songs')
  .select("*")
  .eq('id', songData)
  
    return song![0];
  };

