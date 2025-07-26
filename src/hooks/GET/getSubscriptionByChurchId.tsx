"use client";

import { createClient } from "@/utils/supabase/client";

export const getSubscriptionByChurchId = async (churchId: string) => {
  const supabase = await createClient();

  const { data: sub, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("church", churchId);
  if (error) {
    console.error("Errore durante il fetch:", error);
  }
  return sub;
};
