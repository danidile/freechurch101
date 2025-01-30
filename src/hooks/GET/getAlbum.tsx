"use server";

import { createClient } from "@/utils/supabase/server";

export const getAlbum = async (albumData: unknown) => {
  const supabase = createClient();
  const { data: albums } = await supabase
  .from('albums')
  .select("*")
  .eq('artist_username', albumData);
    return albums;
  };

