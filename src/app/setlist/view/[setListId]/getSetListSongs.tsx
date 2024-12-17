// @ts-nocheck

"use server";
import { createClient } from "@/utils/supabase/server";

// type songType = {
//     id: string;
//     song:{
//       song_title: string;
//       author: string;
//       lyrics: string;
//       upload_key: string;
//     };
//     key: string;
//     notes: string;
// }


export const getSetListSongs = async (setlistId: unknown) => {
  const supabase = createClient();
  const { data ,error } = await supabase
  .from('setlist-songs')
  .select("id, song(song_title, author, lyrics, upload_key),key,notes")
  .eq('setlist_id', setlistId);
  if(error){
    // console.log(error)

  }else{

    const result = data.map((song ) => {
      return {
        id:song.id,
        songTitle: song.song.song_title,
        author: song.song.author,
        lyrics: song.song.lyrics,
        upload_key: song.song.upload_key,
        key: song.key,
        notes: song.notes
      };
    });
    console.log("This is my result"+result);
    return result;
  }
  };

