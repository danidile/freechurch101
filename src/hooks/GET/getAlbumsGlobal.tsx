"use server";

import { createClient } from "@/utils/supabase/server";

export const getAlbumsGlobal = async () => {
  const supabase = await createClient();

  const { data: Albums, error } = await supabase
    .from("albums")
    .select("*")
    .order("artist_username", { ascending: true });

  if (error) {
    console.error("Errore durante il fetch:", error);
  }
  return Albums;
};
