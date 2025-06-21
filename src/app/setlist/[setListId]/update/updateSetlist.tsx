"use server";
import { expandedTeamT, setListSongT, setListT } from "@/utils/types/types";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

import { encodedRedirect } from "@/utils/utils";

function diffById<T extends { id?: string }>(
  newItems: T[],
  oldItems: T[],
  compareFn: (a: T, b: T) => boolean
) {
  const oldMap = new Map(oldItems.map((item) => [item.id, item]));
  const newMap = new Map(newItems.map((item) => [item.id, item]));

  const deleted = oldItems.filter((item) => item.id && !newMap.has(item.id));
  const inserted = newItems.filter((item) => !item.id || !oldMap.has(item.id));
  const updated = newItems.filter((item) => {
    const oldItem = item.id ? oldMap.get(item.id) : undefined;
    return oldItem && compareFn(item, oldItem);
  });

  return { deleted, inserted, updated };
}

// Assuming updatedSetlist.schedule and setlistData.schedule are both available
function prepareScheduleDiff(
  updatedSchedule: setListSongT[],
  oldSchedule: setListSongT[]
) {
  const withIndex = (list: setListSongT[]) =>
    list.map((item, i) => ({ ...item, originalIndex: i }));

  const filterType = (list: setListSongT[], type: string) =>
    list.filter((item) => item.type === type);

  const newItems = withIndex(updatedSchedule);
  const oldItems = withIndex(oldSchedule);

  const songs = filterType(newItems, "song");
  const songsOld = filterType(oldItems, "song");

  const notes = filterType(newItems, "note");
  const notesOld = filterType(oldItems, "note");

  const titles = filterType(newItems, "title");
  const titlesOld = filterType(oldItems, "title");

  const compareSongs = (a: setListSongT, b: setListSongT) =>
    a.song !== b.song || a.key !== b.key || a.originalIndex !== b.originalIndex;

  const compareNotes = (a: setListSongT, b: setListSongT) =>
    a.note !== b.note || a.originalIndex !== b.originalIndex;

  const compareTitles = (a: setListSongT, b: setListSongT) =>
    a.title !== b.title || a.originalIndex !== b.originalIndex;

  const songsDiff = diffById(songs, songsOld, compareSongs);
  const notesDiff = diffById(notes, notesOld, compareNotes);
  const titlesDiff = diffById(titles, titlesOld, compareTitles);

  return {
    songs: songsDiff,
    notes: notesDiff,
    titles: titlesDiff,
  };
}
export const updateSetlistData = async (
  updatedSetlist: setListT,
  setlistData: setListT,
  supabase: SupabaseClient
) => {
  let hasChanged: boolean = false;

  if (
    updatedSetlist.date !== setlistData.date.split("T")[0] ||
    updatedSetlist.event_title !== setlistData.event_title ||
    updatedSetlist.private !== setlistData.private ||
    updatedSetlist.color !== setlistData.color
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
        color: updatedSetlist.color,
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

export const updateSetlistSchedule = async (
  updatedSetlist: setListT,
  setlistData: setListT,
  supabase: SupabaseClient
) => {
  const diff = prepareScheduleDiff(
    updatedSetlist.schedule,
    setlistData.schedule
  );

  console.log("Songs to insert:", diff.songs.inserted);
  console.log("Songs to update:", diff.songs.updated);
  console.log("Songs to delete:", diff.songs.deleted);
  const songsIdsToDelete = diff.songs.deleted
    .map((item) => item.id)
    .filter(Boolean);
  console.log("🗑️ songs to delete:", songsIdsToDelete);
  if (songsIdsToDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from("setlist-songs")
      .delete()
      .in("id", songsIdsToDelete);

    if (deleteError) {
      console.error("🔥 Error deleting removed setlist-songs", deleteError);
    } else {
      console.log("🗑️ Deleted Songs successfully", songsIdsToDelete);
    }
  }
  const songsToUpsert = diff.songs.inserted
    .concat(diff.songs.updated)
    .map((item, index) => {
      const base = {
        setlist_id: setlistData.id,
        id: item.id,
        song: item.song,
        key: item.key,
        order: item.originalIndex,
      };
      return item.id ? { ...base, id: item.id } : base;
    });
  if (songsToUpsert.length >= 1) {
    const { data, error } = await supabase
      .from("setlist-songs")
      .upsert(songsToUpsert, { onConflict: "id" });

    if (error) {
      console.error("❌ Error upserting songs:", error);
    } else {
      console.log("✅ songs upserted successfully:", data);
    }
  }

  console.log("Notes to insert:", diff.notes.inserted);
  console.log("Notes to update:", diff.notes.updated);
  console.log("Notes to delete:", diff.notes.deleted);
  const notesIdsToDelete = diff.notes.deleted
    .map((item) => item.id)
    .filter(Boolean);
  console.log("🗑️ Notes to delete:", notesIdsToDelete);
  if (notesIdsToDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from("setlist-notes")
      .delete()
      .in("id", notesIdsToDelete);

    if (deleteError) {
      console.error("🔥 Error deleting removed setlist-notes", deleteError);
    } else {
      console.log("🗑️ Deleted Notes successfully", notesIdsToDelete);
    }
  }
  const notesToUpsert = diff.notes.inserted
    .concat(diff.notes.updated)
    .map((item, index) => {
      const base = {
        setlist_id: setlistData.id,
        note: item.note,
        order: item.originalIndex,
      };
      return item.id ? { ...base, id: item.id } : base;
    });
  if (notesToUpsert.length >= 1) {
    const { data, error } = await supabase
      .from("setlist-notes")
      .upsert(notesToUpsert, { onConflict: "id" });

    if (error) {
      console.error("❌ Error upserting notes:", error);
    } else {
      console.log("✅ Notes upserted successfully:", data);
    }
  }

  console.log("Titles to insert:", diff.titles.inserted);
  console.log("Titles to update:", diff.titles.updated);
  console.log("Titles to delete:", diff.titles.deleted);
  const titlesIdsToDelete = diff.titles.deleted
    .map((item) => item.id)
    .filter(Boolean);
  console.log("🗑️ Titles to delete:", titlesIdsToDelete);
  if (titlesIdsToDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from("setlist-titles")
      .delete()
      .in("id", titlesIdsToDelete);

    if (deleteError) {
      console.error("🔥 Error deleting removed setlist-titles", deleteError);
    } else {
      console.log("🗑️ Deleted titles successfully", titlesIdsToDelete);
    }
  }
  const titlesToUpsert = diff.titles.inserted
    .concat(diff.titles.updated)
    .map((item, index) => {
      const base = {
        setlist_id: setlistData.id,
        title: item.title,
        order: item.originalIndex,
      };
      return item.id ? { ...base, id: item.id } : base;
    });
  if (titlesToUpsert.length >= 1) {
    const { data, error } = await supabase
      .from("setlist-titles")
      .upsert(titlesToUpsert, { onConflict: "id" });

    if (error) {
      console.error("❌ Error upserting titles:", error);
    } else {
      console.log("✅ Titles upserted successfully:", data);
    }
  }
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
        member: member.profile,
        team: team.id!,
        roles: member.selected_roles,
        status: member.status || "pending",
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
  updateSetlistSchedule(updatedSetlist, setlistData, supabase);
  updateSetlistTeam(updatedSetlist, setlistData, supabase);

  return encodedRedirect(
    "success",
    `/setlist/${updatedSetlist.id}`,
    "Setlist aggiornata con successo!"
  );
};
