"use server";
import { createClient } from "@/utils/supabase/server";
import { RangeValueString } from "@/utils/types/types";
export const updateBlockoutsAction = async ({
  blockedDates,
  preBlockedDates,
}: {
  blockedDates: RangeValueString[];
  preBlockedDates: RangeValueString[];
}) => {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("No user found", userError);
    return;
  }

  // Prepare upsert data
  const upsertDates: RangeValueString[] = blockedDates.map((date) => ({
    ...(date.id ? { id: date.id } : { id: crypto.randomUUID() }),
    profile: date.profile ? date.profile : user.id,
    start: date.start,
    end: date.end,
  }));

  // Find deleted items by comparing IDs
  const oldIds = preBlockedDates
    .map((d) => d.id)
    .filter((id): id is string => !!id);
  const newIds = blockedDates
    .map((d) => d.id)
    .filter((id): id is string => !!id);

  const deletedIds = oldIds.filter((id) => !newIds.includes(id));

  // Delete removed rows
  if (deletedIds.length > 0) {
    const { error: deleteError } = await supabase
      .from("blockouts")
      .delete()
      .in("id", deletedIds);

    if (deleteError) {
      console.error("Delete error", deleteError);
    }
  }

  // Upsert new and updated entries
  const { error: upsertError } = await supabase
    .from("blockouts")
    .upsert(upsertDates)
    .select();

  if (upsertError) {
    console.error("Upsert error", upsertError);
  }
  console.log("Upserting", upsertDates);
  console.log("Deleting IDs", deletedIds);

  return {
    success: !upsertError,
    deleted: deletedIds.length,
    inserted: upsertDates.length,
  };
};
