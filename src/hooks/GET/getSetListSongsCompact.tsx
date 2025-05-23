"use server";
import { createClient } from "@/utils/supabase/server";
import { setListSongT } from "@/utils/types/types";

export const getSetListSongsCompact = async (setlistId: unknown) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("setlist-songs")
    .select("id, song(id, song_title, author),key,order")
    .eq("setlist_id", setlistId);

  if (error) {
    console.log(error);
  } else {
    const result: setListSongT[] = data.map((song: any) => {
      return {
        id: song.id,
        song: song.song.id,
        song_title: song.song.song_title,
        author: song.song.author,
        key: song.key,
        order: song.order,
        type: "songs",
      };
    });

    result.sort((a, b) => a.order - b.order);

    return result;
  }
};
