"use server";
import { createClient } from "@/utils/supabase/server";
import { eventType } from "@/utils/types/types";

const removeEventTypesAction = async (
  eventTypes: eventType[],
  churchId: string
) => {
  const supabase = createClient();
  const toDelete = eventTypes.map((event) => event.id);

  if (toDelete.length > 0) {
    const { data, error } = await supabase
      .from("custom-event-types")
      .delete()
      .in("id", toDelete);

    if (error) {
      console.log("delete", error.message);
    } else {
      console.log("custom-event-types row deleted seccesfully");
    }
  }
};

export default removeEventTypesAction;
