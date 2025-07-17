"use server";
import { createClient } from "@/utils/supabase/server";
import { eventType } from "@/utils/types/types";

const updateEventTypesAction = async (
  eventTypes: eventType[],
  churchId: string
) => {
  const supabase = await createClient();
  eventTypes.map(async (event) => {
    const { data, error } = await supabase
      .from("custom-event-types")
      .update({ label: event.edited })
      .eq("id", event.id)
      .select();
    if (error) {
      console.log("update", error.message);
      return {
        success: false,
        error: error.message,
      };
    } else {
      console.log("custom-event-types table row updated");
      return {
        success: true,
      };
    }
  });
};

export default updateEventTypesAction;
