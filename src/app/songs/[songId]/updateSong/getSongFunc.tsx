"use server";

import { createClient } from "@/utils/supabase/server";
import { getSong } from "../getSong";

export const getSongFunc = async (songData: unknown) => {
    const song = await getSong(songData);
    return 
  };



