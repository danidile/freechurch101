import { defaultEventTypes } from "@/constants";
import { createClient } from "@/utils/supabase/client";

export default async function getChurchEventTypes(churchId: string) {
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
    const enrichedEventTypes = defaultEventTypes.map((event) => {
      const match = formattedEventTypes.find(
        (custom) => custom.key === event.key
      );
      return {
        ...event,
        alt: match?.alt ?? null, // or omit this field entirely if preferred
        id: match?.id ?? null, // or omit this field entirely if preferred
      };
    });
    return enrichedEventTypes;
  }
}
