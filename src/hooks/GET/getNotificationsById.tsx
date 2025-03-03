"use server";

import { createClient } from "@/utils/supabase/server";
import { teamData } from "@/utils/types/types";

export const getNotificationsById = async (userId: string) => {
  const supabase = createClient();
  let { data: notifications, error } = await supabase
    .from("event-team")
    .select(
      `id, 
       setlist:setlist!inner(date, event_title), 
       team:team!inner(team_name)`
    )
    .eq("member", userId)
    .eq("status", "pending");

  if (error) {
    console.error(error);
    return [];
  }

  // Ensure setlist and team are returned as single objects, not arrays
  const formattedNotifications = notifications.map((n) => ({
    id: n.id,
    setlist: Array.isArray(n.setlist) ? n.setlist[0] : n.setlist, // Fixes TypeScript error
    team: Array.isArray(n.team) ? n.team[0] : n.team, // Fixes TypeScript error
  }));
  

  console.log("formatted notifications:", formattedNotifications);
  return formattedNotifications;
};
