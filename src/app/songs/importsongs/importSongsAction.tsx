"use server";
import { createClient } from "@/utils/supabase/server";
import { songType } from "@/utils/types/types";

export const importSongs = async (data: songType[]) => {
  const supabase = await createClient();
  data.map(async (song) => {
    const { error } = await supabase.from("global-songs").upsert(song).select();
    if (error) console.log(error);
    else console.log("Sings ioii");
  });
  console.log("Sings ioii");
};
