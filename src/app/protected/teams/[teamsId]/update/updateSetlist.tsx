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
      .update({
        date: updatedSetlist.date,
        event_title: updatedSetlist.event_title,
      })
      .eq("id", setlistData.id)
      .select();

    if (setlistError) {
      console.log("\x1b[41m Error in setlist Data insert \x1b[0m");
      console.log(setlistError);
    } else {
      console.log("\x1b[42m Success in setlist Data insert \x1b[0m");
    }
  }

  updatedSetlist.setListSongs.map(async (song, index) => {
    let songKey;
    if (typeof song.key === "number" && !isNaN(song.key)) {
      songKey = keys[Number(song.key)];
    } else if (typeof song.key === "string") {
      songKey = song.key;
    }
    // console.log("\x1b[36m%s\x1b[0m", song.key);
    // console.log("\x1b[36m%s\x1b[0m", songKey);

    if (index <= setlistData.setListSongs.length - 1) {
      if (song.type === "songs") {
        const { error } = await supabase
          .from("setlist-songs")
          .update({
            song: song.song,
            key: songKey,
            order: index,
            global_song: null,
          })
          .eq("id", song.id)
          .select();
        console.log("Key");
        console.log(songKey);
      } else if (song.type === "global-songs") {
        const { error } = await supabase
          .from("setlist-songs")
          .update({
            global_song: song.song,
            key: songKey,
            order: index,
            song: null,
          })
          .eq("id", song.id)
          .select();
        console.log("Key");
        console.log(songKey);
      }
    } else {
      console.log(
        "\x1b[36m%s\x1b[0m",
        "line" + index + "was NOT already existent"
      );
      if (song.type === "songs") {
        const { error } = await supabase
          .from("setlist-songs")
          .insert({
            setlist_id: setlistData.id,
            song: song.song,
            key: songKey,
            order: index,
            global_song: null,
          })
          .select();
        console.log("Key");
        console.log(songKey);
      } else if (song.type === "global-songs") {
        const { error } = await supabase
          .from("setlist-songs")
          .insert({
            setlist_id: setlistData.id,

            global_song: song.song,
            key: songKey,
            order: index,
            song: null,
          })
          .select();
        console.log("Key");
        console.log(songKey);
      }
    }

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
  });
  return redirect(`/setlist/${setlistData.id}`);
};
