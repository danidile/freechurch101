import { createClient } from "@/utils/supabase/client";

export const getSongHistory = async (song: string) => {
  const supabase = await createClient();
  const { data: songs, error } = await supabase
    .from("setlist-songs")
    .select("setlist_id(date),key,singer(name,lastname)")
    .eq("song", song);

  if (error) {
    console.error(error);
  } else {
    return songs.length >= 1 ? songs : null;
  }

  return null;
};
