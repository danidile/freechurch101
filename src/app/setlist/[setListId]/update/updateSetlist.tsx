"use server";
import { setListSongT, setListT } from "@/utils/types/types";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { logEvent } from "@/utils/supabase/log";
import { getAuthHeader } from "@/utils/services/authHeader";

// Error tracking type
type ErrorDetail = {
  operation: string;
  message: string;
  code?: string;
  context?: string;
  details?: any;
};

type UpdateResult = {
  success: boolean;
  errors: ErrorDetail[];
  message: string;
};

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
    a.song !== b.song ||
    a.key !== b.key ||
    a.singer !== b.singer ||
    a.originalIndex !== b.originalIndex;

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
  supabase: SupabaseClient<any, any, any>,
  user_id?: string
): Promise<ErrorDetail[]> => {
  const errors: ErrorDetail[] = [];
  let hasChanged: boolean = false;

  if (
    updatedSetlist.date !== setlistData.date.split("T")[0] ||
    updatedSetlist.event_title !== setlistData.event_title ||
    updatedSetlist.private !== setlistData.private ||
    updatedSetlist.room !== setlistData.room ||
    updatedSetlist.hour !== setlistData.hour ||
    updatedSetlist.event_type !== setlistData.event_type
  ) {
    hasChanged = true;
  }

  //If data has changed update it
  if (hasChanged) {
    const { data: setlistSuccess, error: setlistError } = await supabase
      .from("setlist")
      .update({
        date: updatedSetlist.date,
        room: updatedSetlist.room,
        hour: updatedSetlist.hour,
        event_type: updatedSetlist.event_type,
        private: updatedSetlist.private,
      })
      .eq("id", setlistData.id)
      .select();

    if (setlistError) {
      console.log("\x1b[41m Error in setlist Data Update \x1b[0m");
      console.log(setlistError);

      const errorDetail: ErrorDetail = {
        operation: "updateSetlistData",
        message: setlistError.message,
        code: setlistError.code,
        context: "setlist data update",
        details: { setlist_id: setlistData.id },
      };
      errors.push(errorDetail);

      await logEvent({
        event: "update_setlist_data_error",
        level: "error",
        user_id: user_id ?? null,
        meta: {
          message: setlistError.message,
          code: setlistError.code,
          context: "setlist data update",
          setlist_id: setlistData.id,
        },
      });
    } else {
      console.log("\x1b[42m Success in setlist Data Update \x1b[0m");
    }
  } else {
    console.log("\x1b[42m Setlist Data was not changed \x1b[0m");
  }

  return errors;
};

export const updateSetlistSchedule = async (
  updatedSetlist: setListT,
  setlistData: setListT,
  supabase: SupabaseClient<any, any, any>,
  user_id?: string
): Promise<ErrorDetail[]> => {
  const errors: ErrorDetail[] = [];

  const diff = prepareScheduleDiff(
    updatedSetlist.schedule,
    setlistData.schedule
  );

  console.log("Songs to insert:", diff.songs.inserted);
  console.log("Songs to update:", diff.songs.updated);
  console.log("Songs to delete:", diff.songs.deleted);

  // Delete songs
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
      console.log("🔥 Error deleting removed setlist-songs", deleteError);

      const errorDetail: ErrorDetail = {
        operation: "deleteSongs",
        message: deleteError.message,
        code: deleteError.code,
        context: "setlist-songs delete",
        details: { setlist_id: setlistData.id, song_ids: songsIdsToDelete },
      };
      errors.push(errorDetail);

      await logEvent({
        event: "delete_setlist_songs_error",
        level: "error",
        user_id: user_id ?? null,
        meta: {
          message: deleteError.message,
          code: deleteError.code,
          context: "setlist-songs delete",
          setlist_id: setlistData.id,
          song_ids: songsIdsToDelete,
        },
      });
    } else {
      console.log("🗑️ Deleted Songs successfully", songsIdsToDelete);
    }
  }

  // Upsert songs
  const songsToUpsert = diff.songs.inserted
    .concat(diff.songs.updated)
    .map((item, index) => {
      const base = {
        setlist_id: setlistData.id,
        id: item.id,
        song: item.song,
        key: item.key,
        order: item.originalIndex,
        singer: item.singer,
      };
      return item.id ? { ...base, id: item.id } : base;
    });
  if (songsToUpsert.length >= 1) {
    const { data, error } = await supabase
      .from("setlist-songs")
      .upsert(songsToUpsert, { onConflict: "id" });

    if (error) {
      console.log("❌ Error upserting songs:", error);

      const errorDetail: ErrorDetail = {
        operation: "upsertSongs",
        message: error.message,
        code: error.code,
        context: "setlist-songs upsert",
        details: {
          setlist_id: setlistData.id,
          songs_count: songsToUpsert.length,
        },
      };
      errors.push(errorDetail);

      await logEvent({
        event: "upsert_setlist_songs_error",
        level: "error",
        user_id: user_id ?? null,
        meta: {
          message: error.message,
          code: error.code,
          context: "setlist-songs upsert",
          setlist_id: setlistData.id,
          songs_count: songsToUpsert.length,
        },
      });
    } else {
      console.log("✅ songs upserted successfully:", data);
    }
  }

  // Delete notes
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
      console.log("🔥 Error deleting removed setlist-notes", deleteError);

      const errorDetail: ErrorDetail = {
        operation: "deleteNotes",
        message: deleteError.message,
        code: deleteError.code,
        context: "setlist-notes delete",
        details: { setlist_id: setlistData.id, note_ids: notesIdsToDelete },
      };
      errors.push(errorDetail);

      await logEvent({
        event: "delete_setlist_notes_error",
        level: "error",
        user_id: user_id ?? null,
        meta: {
          message: deleteError.message,
          code: deleteError.code,
          context: "setlist-notes delete",
          setlist_id: setlistData.id,
          note_ids: notesIdsToDelete,
        },
      });
    } else {
      console.log("🗑️ Deleted Notes successfully", notesIdsToDelete);
    }
  }

  // Upsert notes
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
      console.log("❌ Error upserting notes:", error);

      const errorDetail: ErrorDetail = {
        operation: "upsertNotes",
        message: error.message,
        code: error.code,
        context: "setlist-notes upsert",
        details: {
          setlist_id: setlistData.id,
          notes_count: notesToUpsert.length,
        },
      };
      errors.push(errorDetail);

      await logEvent({
        event: "upsert_setlist_notes_error",
        level: "error",
        user_id: user_id ?? null,
        meta: {
          message: error.message,
          code: error.code,
          context: "setlist-notes upsert",
          setlist_id: setlistData.id,
          notes_count: notesToUpsert.length,
        },
      });
    } else {
      console.log("✅ Notes upserted successfully:", data);
    }
  }

  // Delete titles
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
      console.log("🔥 Error deleting removed setlist-titles", deleteError);

      const errorDetail: ErrorDetail = {
        operation: "deleteTitles",
        message: deleteError.message,
        code: deleteError.code,
        context: "setlist-titles delete",
        details: { setlist_id: setlistData.id, title_ids: titlesIdsToDelete },
      };
      errors.push(errorDetail);

      await logEvent({
        event: "delete_setlist_titles_error",
        level: "error",
        user_id: user_id ?? null,
        meta: {
          message: deleteError.message,
          code: deleteError.code,
          context: "setlist-titles delete",
          setlist_id: setlistData.id,
          title_ids: titlesIdsToDelete,
        },
      });
    } else {
      console.log("🗑️ Deleted titles successfully", titlesIdsToDelete);
    }
  }

  // Upsert titles
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
      console.log("❌ Error upserting titles:", error);

      const errorDetail: ErrorDetail = {
        operation: "upsertTitles",
        message: error.message,
        code: error.code,
        context: "setlist-titles upsert",
        details: {
          setlist_id: setlistData.id,
          titles_count: titlesToUpsert.length,
        },
      };
      errors.push(errorDetail);

      await logEvent({
        event: "upsert_setlist_titles_error",
        level: "error",
        user_id: user_id ?? null,
        meta: {
          message: error.message,
          code: error.code,
          context: "setlist-titles upsert",
          setlist_id: setlistData.id,
          titles_count: titlesToUpsert.length,
        },
      });
    } else {
      console.log("✅ Titles upserted successfully:", data);
    }
  }

  return errors;
};

type FlattenedMember = {
  id?: string;
  member: string; // profile id
  setlist: string;
  team: string;
  roles: string;
  status: string;
  lead: boolean; // Ensure lead is a boolean
};

function flattenTeams(setlist: setListT): FlattenedMember[] {
  return (
    setlist.teams?.flatMap(
      (team) =>
        team.selected?.map((member) => ({
          id: member.id,
          member: member.profile,
          setlist: setlist.id!,
          team: team.id!,
          roles: member.selected_roles!,
          status: member.status || "pending",
          lead: member.lead ? true : false, // Ensure lead is a boolean
        })) ?? []
    ) ?? []
  );
}

function compareTeamMembers(a: FlattenedMember, b: FlattenedMember) {
  return (
    a.team !== b.team ||
    a.status !== b.status ||
    a.lead !== b.lead ||
    JSON.stringify(a.roles) !== JSON.stringify(b.roles)
  );
}

export const updateSetlistTeam = async (
  updatedSetlist: setListT,
  setlistData: setListT,
  supabase: SupabaseClient<any, any, any>,
  user_id?: string
): Promise<ErrorDetail[]> => {
  const errors: ErrorDetail[] = [];

  const newMembers = flattenTeams(updatedSetlist);
  const oldMembers = flattenTeams(setlistData);

  const { inserted, deleted, updated } = diffById(
    newMembers,
    oldMembers,
    compareTeamMembers
  );

  console.log("⚙️ Team Members inserted", inserted);
  console.log("⚙️ Team Members deleted", deleted);
  console.log("⚙️ Team Members updated", updated);

  // Delete team members
  const teamMemberstoDelete = deleted.map((item) => item.id).filter(Boolean);
  console.log("🗑️ Ids teamMembers to delete:", teamMemberstoDelete);
  if (teamMemberstoDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from("event-team")
      .delete()
      .in("id", teamMemberstoDelete);

    if (deleteError) {
      console.log("🔥 Error deleting removed event-team", deleteError);

      const errorDetail: ErrorDetail = {
        operation: "deleteTeamMembers",
        message: deleteError.message,
        code: deleteError.code,
        context: "event-team delete",
        details: {
          setlist_id: setlistData.id,
          member_ids: teamMemberstoDelete,
        },
      };
      errors.push(errorDetail);

      await logEvent({
        event: "delete_setlist_team_error",
        level: "error",
        user_id: user_id ?? null,
        meta: {
          message: deleteError.message,
          code: deleteError.code,
          context: "event-team delete",
          setlist_id: setlistData.id,
          member_ids: teamMemberstoDelete,
        },
      });
    } else {
      console.log("🗑️ Deleted team members successfully", teamMemberstoDelete);
    }
  }

  // Insert team members
  if (inserted.length > 0) {
    const insertedWithoutIds = inserted.map(({ id, ...rest }) => rest);

    const { error: insertError } = await supabase
      .from("event-team")
      .insert(insertedWithoutIds)
      .select();

    if (insertError) {
      console.log("🔥 Error Inserting new TeamMembers", insertError);

      const errorDetail: ErrorDetail = {
        operation: "insertTeamMembers",
        message: insertError.message,
        code: insertError.code,
        context: "event-team insert",
        details: { setlist_id: setlistData.id, members_count: inserted.length },
      };
      errors.push(errorDetail);

      await logEvent({
        event: "insert_setlist_team_error",
        level: "error",
        user_id: user_id ?? null,
        meta: {
          message: insertError.message,
          code: insertError.code,
          context: "event-team insert",
          setlist_id: setlistData.id,
          members_count: inserted.length,
        },
      });
    } else {
      console.log("✅ TeamMembers Inserted successfully", inserted);
    }
  }

  // Update team members
  if (updated.length > 0) {
    const updateResults = await Promise.all(
      updated.map(({ id, ...data }) => {
        if (!id) return Promise.resolve({ error: "Missing id" });
        return supabase
          .from("event-team")
          .update(data)
          .eq("id", id)
          .select()
          .then(({ error }) => ({ error, id }));
      })
    );

    const failedUpdates = updateResults.filter((r) => r.error);
    if (failedUpdates.length > 0) {
      console.log("🔥 Errors updating members:", failedUpdates);

      const errorDetail: ErrorDetail = {
        operation: "updateTeamMembers",
        message: "Multiple update errors occurred",
        context: "event-team update",
        details: {
          setlist_id: setlistData.id,
          failed_updates: failedUpdates,
          attempted_updates: updated.length,
        },
      };
      errors.push(errorDetail);

      await logEvent({
        event: "update_setlist_team_error",
        level: "error",
        user_id: user_id ?? null,
        meta: {
          message: "Multiple update errors",
          context: "event-team update",
          setlist_id: setlistData.id,
          errors: failedUpdates.map((e) => e.error),
          attempted_updates: updated.length,
        },
      });
    } else {
      console.log("✅ Team members updated successfully");
    }
  }

  return errors;
};

export const updateSetlist = async (
  updatedSetlist: setListT,
  setlistData: setListT,
  user_id?: string
): Promise<UpdateResult> => {
  const supabase = await createClient();
  const allErrors: ErrorDetail[] = [];
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("❌ Error getting session:", error);
  } else {
    console.log(
      "🔑 Supabase session token:",
      session?.access_token ?? "MISSING"
    );
  }
  try {
    // Execute all update operations and collect errors
    const dataErrors = await updateSetlistData(
      updatedSetlist,
      setlistData,
      supabase,
      user_id
    );
    const scheduleErrors = await updateSetlistSchedule(
      updatedSetlist,
      setlistData,
      supabase,
      user_id
    );
    const teamErrors = await updateSetlistTeam(
      updatedSetlist,
      setlistData,
      supabase,
      user_id
    );

    // Combine all errors
    allErrors.push(...dataErrors, ...scheduleErrors, ...teamErrors);

    // Log all errors to console for client-side visibility
    if (allErrors.length > 0) {
      console.error("❌ Setlist update completed with errors:");
      allErrors.forEach((error, index) => {
        console.error(`Error ${index + 1}:`, error);
      });

      return {
        success: false,
        errors: allErrors,
        message: `Setlist update completed with ${allErrors.length} error(s). Check console for details.`,
      };
    }

    console.log("✅ Setlist updated successfully with no errors");
    return {
      success: true,
      errors: [],
      message: "Setlist aggiornata con successo!",
    };
  } catch (unexpectedError: any) {
    console.error(
      "🔥 Unexpected error during setlist update:",
      unexpectedError
    );

    const criticalError: ErrorDetail = {
      operation: "updateSetlist",
      message: unexpectedError?.message || "Unknown error occurred",
      context: "critical error",
      details: { setlist_id: setlistData.id, error: unexpectedError },
    };

    allErrors.push(criticalError);

    // Log critical error
    await logEvent({
      event: "update_setlist_critical_error",
      level: "error",
      user_id: user_id ?? null,
      meta: {
        message: unexpectedError?.message || "Unknown error",
        context: "critical error",
        setlist_id: setlistData.id,
        stack: unexpectedError?.stack,
      },
    });

    return {
      success: false,
      errors: allErrors,
      message:
        "Critical error occurred during setlist update. Check console for details.",
    };
  }
};
