"use server";
import { createClient } from "@/utils/supabase/server";
import { eventType } from "@/utils/types/types";

const updateEventTypesAction = async (
  eventTypes: eventType[],
  churchId: string
) => {
  const supabase = createClient();
  const mapped = eventTypes.map((type) => ({
    ...(type.id ? { id: type.id } : {}),
    key: type.key,
    label: type.alt,
    church: churchId,
  }));
  const toUpsert = mapped.filter((item) => item.id); // has id — update
  const toInsert = mapped.filter((item) => !item.id); // no id — insert new
  const toDelete = mapped.filter((item) => item.label.length === 0); // no id — insert new

  console.log("toUpsert", toUpsert);
  console.log("toInsert", toInsert);
  console.log("toDelete", toDelete);
  if (toUpsert.length > 0) {
    const { data, error } = await supabase
      .from("custom-event-types")
      .upsert(toUpsert, { onConflict: "id" })
      .select();
    if (error) throw new Error(error.message);
  }

  if (toDelete.length > 0) {
    const idsToDelete = toDelete.map((event) => event.id);

    const { data, error } = await supabase
      .from("custom-event-types")
      .delete()
      .in("id", idsToDelete);

    if (error) throw new Error(error.message);
  }

  if (toInsert.length > 0) {
    const { data, error } = await supabase
      .from("custom-event-types")
      .insert(toInsert)
      .select();
    if (error) throw new Error(error.message);
  }
};

export default updateEventTypesAction;
