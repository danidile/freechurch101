"use server";
import { createClient } from "@/utils/supabase/server";
import { setListSongT } from "@/utils/types/types";

export const getSetListSongs = async (setlistId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("setlist-songs")
    .select("id, song(id, song_title, author,lyrics,upload_key),key,order")
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
        lyrics: song.song.lyrics,
        upload_key: song.song.upload_key,
      };
    });

    return result;
  }
};
