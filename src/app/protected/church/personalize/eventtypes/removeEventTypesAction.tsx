"use server";
import { createClient } from "@/utils/supabase/server";
import { eventType } from "@/utils/types/types";

const removeEventTypesAction = async (
  eventTypes: eventType[],
  churchId: string
) => {
  const supabase = await createClient();
  const toDelete = eventTypes.map((event) => event.id);

  if (toDelete.length > 0) {
    const { data, error } = await supabase
      .from("custom-event-types")
      .delete()
      .in("id", toDelete);

    if (error) {
      console.log("delete", error.message);
      return {
        success: false,
        error: error.message,
      };
    } else {
      console.log("custom-event-types row deleted seccesfully");
      return {
        success: true,
      };
    }
  }
};

export default removeEventTypesAction;
