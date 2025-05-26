"use server";

import fbasicUserData from "@/utils/supabase/getUserData";
import { createClient } from "@/utils/supabase/server";
import { basicUserData } from "@/utils/types/userData";

export const getSongs = async () => {
  const supabase = createClient();
  const user: basicUserData = await fbasicUserData();
  if (user.loggedIn) {
    const { data: songs, error } = await supabase
      .from("songs")
      .select("*")
      .order("song_title", { ascending: true })
      .eq("church", user.church_id);
    if (error) {
      console.error("Errore durante il fetch:", error);
    }
    return songs;
  } else {
    const { data: songs, error } = await supabase
      .from("global-songs")
      .select("*")
      .order("song_title", { ascending: true });
    if (error) {
      console.error("Errore durante il fetch:", error);
    }
    return songs;
  }
};
