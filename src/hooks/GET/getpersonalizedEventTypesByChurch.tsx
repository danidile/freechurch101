"use server";

import { createClient } from "@/utils/supabase/server";

export const getpersonalizedEventTypesByChurch = async (churchId: unknown) => {
  const supabase = await createClient();
  const { data: eventTypes } = await supabase
    .from("custom-event-types")
    .select("*")
    .eq("church", churchId);

  if (eventTypes) {
    const formattedEventTypes = eventTypes.map((eventType) => {
      return {
        id: eventType.id,
        key: eventType.key,
        alt: eventType.label,
      };
    });
    return formattedEventTypes;
  }
};
