"use client";

import { createClient } from "@/utils/supabase/client";

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
       setlist(date, event_title), 
       team(team_name),status`
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
