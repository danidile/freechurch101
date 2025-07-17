"use server";

import { createClient } from "@/utils/supabase/server";

export const getArtistsGlobal = async () => {
  const supabase = await createClient();

  const { data: Artists, error } = await supabase
    .from("artists")
    .select("*")
    .order("artist_name", { ascending: true });

  if (error) {
    console.error("Errore durante il fetch:", error);
  }
  return Artists;
};
