"use server";
import { expandedTeamT, setListT } from "@/utils/types/types";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";

export const updateSetlist = async (
  updatedSetlist: setListT,
  setlistData: setListT
) => {
  // check if generic data has changed
  let hasChanged: boolean = false;

  if (
    updatedSetlist.date !== setlistData.date.split("T")[0] ||
    updatedSetlist.event_title !== setlistData.event_title
  ) {
    hasChanged = true;
  }

  const supabase = createClient();
  //If data ahs changed update it
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
  } else {
    console.log("\x1b[42m Setlist Data was not changed \x1b[0m");
  }

  // mappo attraverso le setlist di setlistData e inserisco il valore della setlist dentro updatedSetlist con lo stesso index
  // in questo modo garantisco che gli setlistID sono gli stessi e nel caso in cui devo cancellare un campo devo solo
  // controllare se il campo song del della setlist è vuota. Se è vuola vuol dire che c'era una setlist ma è stat cancellata
  //Format data

  setlistData.setListSongs.map((setlist, index) => {
    if (updatedSetlist.setListSongs[index]) {
      updatedSetlist.setListSongs[index].id = setlist.id;
    } else {
      updatedSetlist.setListSongs.push({
        id: setlist.id,
      });
    }
  });

  // Update songs

  updatedSetlist.setListSongs.map(async (song, index) => {
    if (song.type === "global-songs") {
      song.global_song = song.song;
      song.song = null;
      console.log("\x1b[36m%s\x1b[0m", "Song was global_");
    }
    if (song.song || song.global_song) {
      // Check if the field is empty
      const { data, error } = await supabase.from("setlist-songs").upsert(
        {
          setlist_id: setlistData.id,
          id: song.id,
          song: song.song,
          global_song: song.global_song,
          key: song.key,
          order: index,
        },
        { onConflict: "id" }
      );
      if (error) {
        console.log("\x1b[36m%s\x1b[0m", "ERROR");
        console.log("\x1b[36m%s\x1b[0m", error);
      } else {
        console.log("\x1b[36m%s\x1b[0m", "SUCCESS");
        console.log("\x1b[36m%s\x1b[0m", data);
      }
    } else {
      const { error } = await supabase
        .from("setlist-songs")
        .delete()
        .eq("id", song.id);
    }
  });
  console.log("updatedSetlist");
  console.log(updatedSetlist);
  console.log("setlistData");
  console.log(setlistData);

  const updateTeam: expandedTeamT[] = [];
  updatedSetlist.teams.map((team) => {
    team.selected.map((member) => {
      updateTeam.push({
        id: member.id || crypto.randomUUID(),
        setlist: setlistData.id,
        member: member.profile,
        team: team.id,
      });
    });
  });
  console.log("updateTeam");
  console.log(updateTeam);
  const { data, error: errorTeam } = await supabase
    .from("event-team")
    .upsert(updateTeam, { onConflict: "id" });
  if (errorTeam) {
    console.log("\x1b[36m%s\x1b[0m", "ERRORTEAM");
    console.log("\x1b[36m%s\x1b[0m", errorTeam);
  }

  return encodedRedirect(
    "success",
    `/setlist/${updatedSetlist.id}`,
    "Setlist aggiornata con successo!"
  );
};
