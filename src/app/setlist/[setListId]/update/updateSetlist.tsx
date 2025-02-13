"use server";
import { setListT } from "@/utils/types/types";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export const updateSetlist = async (
  updatedSetlist: setListT,
  setlistData: setListT
) => {
  let hasChanged: boolean = false;
  const keys = [
    "A",
    "A#",
    "B",
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
  ];
  if (updatedSetlist.id !== setlistData.id) {
    return redirect("/setlist");
  }
  if (updatedSetlist.date !== setlistData.date) {
    hasChanged = true;
  }
  if (updatedSetlist.event_title !== setlistData.event_title) {
    hasChanged = true;
  }

  const supabase = createClient();

  if (hasChanged) {
    const { data: setlistSuccess, error: setlistError } = await supabase
      .from("setlist")
      .insert({
        date: updatedSetlist.date,
        event_title: updatedSetlist.event_title
      })
      .select()
      .single();





      if (setlistError) {
        console.log("\x1b[41m Error in setlist Data insert \x1b[0m");
        console.log(setlistError);
      } else {
        console.log("\x1b[42m Success in setlist Data insert \x1b[0m");
      }
  }
  updatedSetlist.setListSongs.map(async (song, index) => {
    if (setlistData.setListSongs[index]) {
      if (song.song !== setlistData.setListSongs[index].song || song.tonalita !== setlistData.setListSongs[index].tonalita) {
        console.log("\x1b[36m%s\x1b[0m", "UPDATE!!");

        console.log("\x1b[36m%s\x1b[0m", "the");
        console.log("\x1b[36m%s\x1b[0m", index);
        console.log("\x1b[36m%s\x1b[0m", "song has been edited");
        const { error } = await supabase
          .from("setlist-songs")
          .update({ song: song.song, key: keys[Number(song.tonalita)], order: index })
          .eq("id", song.id)
          .select();

        // if (error) {
        //   console.error(error.code + " " + error.message);
        //   console.log("\x1b[36m%s\x1b[0m", "ERRRRRROR");
        //   return encodedRedirect("error", "/sign-up", error.message);
        // }
        // else {
        //   return encodedRedirect(
        //     "success",
        //     `/setlist/${updatedSetlist.id}`,
        //     "Setlist aggiornata con successo!"
        //   );
        // }
      }
    } else {
      const { data, error: insertError } = await supabase
        .from("setlist-songs")
        .insert({
          setlist_id: updatedSetlist.id,
          song: song.song,
          key: keys[Number(song.tonalita)] ,
          order: index,
        })
        .select();
      if (insertError) {
        console.log("\x1b[41m Error in setlistSong insert \x1b[0m");
        console.log(insertError);
      } else {
        console.log("\x1b[42m Success in setlistSong insert \x1b[0m");
      }
    }
  });
  return redirect(`/setlist/${setlistData.id}`);

}