"use client";

import fbasicUserData from "@/utils/supabase/getUserData";
import { createClient } from "@/utils/supabase/client";
import { basicUserData } from "@/utils/types/userData";
import { useUserStore } from "@/store/useUserStore";

export const getSongs = async (userData: basicUserData) => {
  const supabase = createClient();

  if (userData.loggedIn && userData.church_id) {
    const { data: songs, error } = await supabase
      .from("songs")
      .select("*")
      .order("song_title", { ascending: true })
      .eq("church", userData.church_id);
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
