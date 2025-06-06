"use server";

import { createClient } from "@/utils/supabase/server";

export const getPendingNotificationsById = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0; // Safeguard for null user

  const today = new Date().toISOString().split("T")[0]; // Get today's date in "YYYY-MM-DD"

  let { data: notifications, error } = await supabase
    .from("event-team")
    .select(
      `id, 
       setlist:setlist!inner(date, event_title), 
       team:team!inner(team_name),status`
    )
    .eq("member", user.id)
    .eq("status", "pending")
    .gte("setlist.date", today);

  if (error) {
    console.error(error);
    return 0;
  }

  return notifications.length;
};
