"use server";

import { createClient } from "@/utils/supabase/server";
import {
  GroupedNotificationsT,
  notificationT,
  teamData,
} from "@/utils/types/types";

export const getPendingNotificationsById = async (
  userId: string
): Promise<number> => {
  const supabase = createClient();
  const today = new Date().toISOString().split("T")[0]; // Get today's date in "YYYY-MM-DD"

  let { data: notifications, error } = await supabase
    .from("event-team")
    .select(
      `id, 
       setlist:setlist!inner(date, event_title), 
       team:team!inner(team_name),status`
    )
    .eq("member", userId)
    .eq("status", "pending")
    .gte("setlist.date", today);

  if (error) {
    console.error(error);
    return 0;
  }

  return notifications.length;
};
