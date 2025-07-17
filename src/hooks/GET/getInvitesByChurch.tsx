"use server";

import { createClient } from "@/utils/supabase/server";

export const getInvitesByChurch = async (churchId: unknown) => {
  const supabase = await createClient();
  const { data: eventTypes, error } = await supabase
    .from("pending_invites")
    .select("*")
    .eq("church", churchId);
  if (error) {
    console.log("error", error);
    return [];
  } else {
    return eventTypes;
  }
};
