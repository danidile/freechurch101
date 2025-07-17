"use server";
import { createClient } from "@/utils/supabase/server";
import { eventType } from "@/utils/types/types";

const addEventTypesAction = async (
  eventTypes: eventType[],
  churchId: string
) => {
  const supabase = await createClient();
  const formattedEventTypes = eventTypes.map((event) => {
    return {
      key: event.key,
      label: event.edited,
      church: churchId,
    };
  });
  console.log("formattedEventTypes", formattedEventTypes);
  if (eventTypes.length > 0) {
    const { data, error } = await supabase
      .from("custom-event-types")
      .insert(formattedEventTypes)
      .select();
    if (error) {
      console.log(error.message);
      return {
        success: false,
        error: error.message,
      };
    } else {
      console.log("custom-event-types table row inserted");
      return {
        success: true,
      };
    }
  }
};

export default addEventTypesAction;
