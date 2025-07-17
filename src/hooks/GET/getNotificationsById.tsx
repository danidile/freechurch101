"use server";

import { createClient } from "@/utils/supabase/client";
import {
  GroupedNotificationsT,
  notificationT,
  teamData,
} from "@/utils/types/types";

export const getNotificationsById = async (
  userId: string
): Promise<GroupedNotificationsT> => {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0]; // Get today's date in "YYYY-MM-DD"

  let { data: notifications, error } = await supabase
    .from("event-team")
    .select(
      `id, 
       setlist:setlist!inner(date, event_title,event_type), 
       team:team!inner(team_name),status`
    )
    .eq("member", userId)
    .gte("setlist.date", today);

  if (error) {
    console.error(error);
    return { pending: {}, confirmed: {}, denied: {} };
  }

  // Ensure setlist and team are returned as single objects, not arrays
  const formattedNotifications = notifications.map((n) => ({
    id: n.id,
    setlist: Array.isArray(n.setlist) ? n.setlist[0] : n.setlist, // Fixes TypeScript error
    team: Array.isArray(n.team) ? n.team[0] : n.team, // Fixes TypeScript error
    status: n.status,
  }));

  const groupedNotifications: GroupedNotificationsT = {
    pending: {
      details: {
        title: "Da confermare",
        color: "#f0a736",
      },
      notifications: [],
    },
    confirmed: {
      details: {
        title: "Confermati",
        color: "#46af3b",
      },
      notifications: [],
    },
    denied: {
      details: {
        title: "Rifiutati",
        color: "#e44d42",
      },
      notifications: [],
    },
  };
  formattedNotifications.map((notification: notificationT) => {
    if (notification.status === "pending") {
      groupedNotifications.pending.notifications.push(notification);
    } else if (notification.status === "confirmed") {
      groupedNotifications.confirmed.notifications.push(notification);
    } else if (notification.status === "denied") {
      groupedNotifications.denied.notifications.push(notification);
    }
  });

  return groupedNotifications;
};
