"use server";

import { createClient } from "@/utils/supabase/server";

export const getSetListSongs = async (setlistId: unknown) => {
  const supabase = createClient();
  const { data,error } = await supabase
  .from('setlist-songs')
  .select("id, song(song_title, author, lyrics, upload_key),key,notes")
  .eq('setlist_id', setlistId);
  if(error){
    // console.log(error)
    return error;

  }else{
    // console.log(data);
    return data;
  }
  };

