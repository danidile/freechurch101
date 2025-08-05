"use server";
import { scheduleTemplate, setListSongT, setListT } from "@/utils/types/types";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

import { encodedRedirect } from "@/utils/utils";
import { logEvent } from "@/utils/supabase/log";

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

function prepareScheduleDiff(
  updatedSchedule: setListSongT[],
  oldSchedule: setListSongT[]
) {
  const withIndex = (list: setListSongT[]) =>
    list.map((item, i) => ({ ...item, order: i }));
  const compareFn = (a: setListSongT, b: setListSongT) => {
    if (a.type !== b.type) return true;
    if (a.order !== b.order) return true;

    switch (a.type) {
      case "song":
        return a.song !== b.song || a.key !== b.key || a.singer !== b.singer;
      case "note":
        return a.note !== b.note;
      case "title":
        return a.title !== b.title;
      default:
        return true;
    }
  };

  const newItems = withIndex(updatedSchedule);
  const oldItems = withIndex(oldSchedule);

  return diffById(newItems, oldItems, compareFn);
}
const updateSetlistSchedule = async (
  updatedSetlist: setListT,
  setlistData: setListT,
  supabase: SupabaseClient<any, any, any>
) => {
  const diff = prepareScheduleDiff(
    updatedSetlist.schedule,
    setlistData.schedule
  );

  // DELETE removed items
  const idsToDelete = diff.deleted.map((item) => item.id).filter(Boolean);
  if (idsToDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from("schedule-template-elements")
      .delete()
      .in("id", idsToDelete);

    if (deleteError) {
      console.error(
        "🔥 Error deleting removed schedule-template items",
        deleteError
      );
      await logEvent({
        event: "delete_schedule-template_error",
        level: "error",
        meta: {
          message: deleteError.message,
          code: deleteError.code,
          context: "schedule-template delete",
          setlist_id: setlistData.id,
          item_ids: idsToDelete,
        },
      });
    } else {
      console.log(
        "🗑️ Deleted schedule-template items successfully",
        idsToDelete
      );
    }
  }

  // UPSERT new and updated items
  const upsertItems = diff.inserted.concat(diff.updated).map((item, i) => {
    let content: string | null = null;
    if (item.type === "title") content = item.title;
    if (item.type === "note") content = item.note;
    return {
      id: item.id,
      type: item.type,
      content: content,
      template: setlistData.id,
      order: item.order,
    };
  });
  console.log(upsertItems);

  if (upsertItems.length > 0) {
    const { data, error } = await supabase
      .from("schedule-template-elements")
      .upsert(upsertItems, { onConflict: "id" });

    if (error) {
      console.error("❌ Error upserting schedule-template items", error);
      await logEvent({
        event: "upsert_schedule-template_error",
        level: "error",
        meta: {
          message: error.message,
          code: error.code,
          context: "schedule-template upsert",
          setlist_id: setlistData.id,
          items_count: upsertItems.length,
        },
      });
    } else {
      console.log("✅ schedule-template items upserted successfully", data);
    }
  }
};

export const updateScheduleTemplateData = async (
  updatedScheduleData: scheduleTemplate,
  scheduleData: scheduleTemplate,
  supabase: SupabaseClient<any, any, any>
) => {
  let hasChanged: boolean = false;

  if (updatedScheduleData.name !== scheduleData.name) {
    hasChanged = true;
  }

  //If data has changed update it
  if (hasChanged) {
    const { error: setlistError } = await supabase
      .from("schedule-template")
      .update({
        name: updatedScheduleData.name,
      })
      .eq("id", scheduleData.id)
      .select();

    if (setlistError) {
      console.log("\x1b[41m Error in schedule_template Data Update \x1b[0m");
      console.log(setlistError);

      await logEvent({
        event: "update_schedule_template_data_error",
        level: "error",
        meta: {
          message: setlistError.message,
          code: setlistError.code,
          context: "setlist data update",
          setlist_id: scheduleData.id,
        },
      });
    } else {
      console.log("\x1b[42m Success in schedule_template Data Update \x1b[0m");
    }
  } else {
    console.log("\x1b[42m schedule_template Data was not changed \x1b[0m");
  }
};
export const updateScheduleTemplate = async (
  updatedSetlist: scheduleTemplate,
  setlistData: scheduleTemplate
) => {
  const supabase = await createClient();

  await updateScheduleTemplateData(updatedSetlist, setlistData, supabase);
  await updateSetlistSchedule(updatedSetlist, setlistData, supabase);

  return encodedRedirect(
    "success",
    `/protected/church/personalize/schedule-template/${setlistData.id}`,
    "Setlist aggiornata con successo!"
  );
};
