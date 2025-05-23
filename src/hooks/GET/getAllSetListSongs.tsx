"use server";
import { createClient } from "@/utils/supabase/server";
import { setListSongT } from "@/utils/types/types";

export const getAllSetListSongs = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("setlist-songs")
    .select(
      "id, song(id, song_title, author,lyrics,upload_key),global_song(id,song_title, author,lyrics,upload_key),key,order"
    );

  if (error) {
    console.log(error);
  } else {
    const result: setListSongT[] = data.map((song: any) => {
      if (song.song) {
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
      } else {
        return {
          id: song.id,
          song: song.global_song.id,
          song_title: song.global_song.song_title,
          author: song.global_song.author,
          lyrics: song.global_song.lyrics,
          key: song.key,
          order: song.order,
          upload_key: song.global_song.upload_key,
        };
      }
    });

    return result;
  }
};
