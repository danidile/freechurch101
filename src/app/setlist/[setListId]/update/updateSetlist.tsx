"use server";
import { expandedTeamT, setListT } from "@/utils/types/types";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

import { encodedRedirect } from "@/utils/utils";

export const updateSetlistData = async (
  updatedSetlist: setListT,
  setlistData: setListT,
  supabase: SupabaseClient
) => {
  let hasChanged: boolean = false;

  if (
    updatedSetlist.date !== setlistData.date.split("T")[0] ||
    updatedSetlist.event_title !== setlistData.event_title ||
    updatedSetlist.private !== setlistData.private
  ) {
    hasChanged = true;
  }

  //If data ahs changed update it
  if (hasChanged) {
    const { data: setlistSuccess, error: setlistError } = await supabase
      .from("setlist")
      .update({
        date: updatedSetlist.date,
        event_title: updatedSetlist.event_title,
        private: updatedSetlist.private,
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
};
export const updateSetlistSongs = async (
  updatedSetlist: setListT,
  setlistData: setListT,
  supabase: SupabaseClient
) => {
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
    if (song.song) {
      // Check if the field is empty
      const { data, error } = await supabase.from("setlist-songs").upsert(
        {
          setlist_id: setlistData.id,
          id: song.id,
          song: song.song,
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
};
export const updateSetlistTeam = async (
  updatedSetlist: setListT,
  setlistData: setListT,
  supabase: SupabaseClient
) => {
  if (!setlistData.id) return;

  console.log("⚙️ setlistData.teams", setlistData.teams);
  console.log("⚙️ updatedSetlist.teams", updatedSetlist.teams);

  const updateTeam: expandedTeamT[] = [];
  const updatedIds = new Set<string>();

  updatedSetlist.teams?.forEach((team) => {
    team.selected?.forEach((member) => {
      const memberId = member.id || crypto.randomUUID();
      updatedIds.add(memberId);

      updateTeam.push({
        id: memberId,
        setlist: setlistData.id!,
        member: member.isTemp ? null : member.profile || null,
        temp_profile: member.isTemp ? member.profile || null : null,
        team: team.id!,
      });
    });
  });

  console.log("✅ updatedIds", Array.from(updatedIds));
  console.log("🆕 updateTeam", updateTeam);

  const previousIds: string[] = [];
  setlistData.teams?.forEach((team) => {
    team.selected?.forEach((member) => {
      if (member.id) {
        previousIds.push(member.id);
      }
    });
  });

  console.log("📦 previousIds", previousIds);

  const toDeleteIds = previousIds.filter((id) => !updatedIds.has(id));

  console.log("❌ toDeleteIds", toDeleteIds);

  if (toDeleteIds.length > 0) {
    const { error: deleteError } = await supabase
      .from("event-team")
      .delete()
      .in("id", toDeleteIds);

    if (deleteError) {
      console.error("🔥 Error deleting removed team members", deleteError);
    } else {
      console.log("🗑️ Deleted members successfully", toDeleteIds);
    }
  }

  const { error: upsertError } = await supabase
    .from("event-team")
    .upsert(updateTeam, { onConflict: "id" });

  if (upsertError) {
    console.error("🔥 Error upserting team members", upsertError);
  } else {
    console.log("✅ Upserted team members");
  }
};

export const updateSetlist = async (
  updatedSetlist: setListT,
  setlistData: setListT
) => {
  // check if generic data has changed
  const supabase = createClient();

  updateSetlistData(updatedSetlist, setlistData, supabase);
  updateSetlistSongs(updatedSetlist, setlistData, supabase);
  updateSetlistTeam(updatedSetlist, setlistData, supabase);

  return encodedRedirect(
    "success",
    `/setlist/${updatedSetlist.id}`,
    "Setlist aggiornata con successo!"
  );
};
