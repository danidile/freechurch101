"use server";
import { createClient } from "@/utils/supabase/server";
import { setListSongT, songType } from "@/utils/types/types";

export const formatSetlistSongs = async (data: setListSongT[]) => {
  const supabase = createClient();
  data.map(async (song) => {
    const { error } = await supabase
      .from("setlist-songs")
      .update({ song: song.song, global_song: null })
      .eq("id", song.id)
      .select();
    if (error) console.log(error);
    else console.log("Sings ioii");
  });
  console.log("Sings ioii");
};
