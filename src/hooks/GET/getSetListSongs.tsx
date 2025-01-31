// @ts-nocheck

"use server";
import { createClient } from "@/utils/supabase/server";

export const getSetListSongs = async (setlistId: unknown) => {
  const supabase = createClient();
  const { data ,error } = await supabase
  .from('setlist-songs')
  .select("id, song(song_title, author, lyrics, upload_key),global_song(song_title, author, lyrics, upload_key),key,notes,order")
  .eq('setlist_id', setlistId);
  
  if(error){
    // console.log(error)

  }else{

    const result = data.map((song ) => {
      if(song.song){
      return {
        id:song.id,
        songTitle: song.song.song_title,
        author: song.song.author,
        lyrics: song.song.lyrics,
        upload_key: song.song.upload_key,
        key: song.key,
        notes: song.notes,
        order: song.order
      }}
      else{
        return {
          id:song.id,
          songTitle: song.global_song.song_title,
          author: song.global_song.author,
          lyrics: song.global_song.lyrics,
          upload_key: song.global_song.upload_key,
          key: song.key,
          notes: song.notes,
          order: song.order
        }
      }
    });
    console.log("This is my result"+result);
    return result;
  }
  };

