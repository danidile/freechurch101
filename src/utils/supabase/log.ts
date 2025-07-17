import { createClient } from "./server";

export async function logEvent({
  event,
  user_id = null,
  meta = {},
  level = "info",
}: {
  event: string;
  user_id?: string | null;
  meta?: Record<string, any>;
  level?: "info" | "warn" | "error";
}) {
  const supabase = await createClient();
  console.log("[", level, "]", event);
  await supabase.from("logs").insert([{ event, user_id, meta, level }]);
}
