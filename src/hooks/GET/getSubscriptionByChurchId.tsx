"use client";

import { createClient } from "@/utils/supabase/client";

export const getSubscriptionByChurchId = async (churchId: string) => {
  const supabase = await createClient();

  // Get subscription with invoices
  const { data, error } = await supabase
    .from("subscriptions")
    .select(
      `
      *
    `
    )
    .eq("church", churchId)
    .single();

  if (error) {
    console.error("Errore durante il fetch:", error);
    return null;
  }

  // Transform the data to match the expected Subscription format
  if (data) {
    return data;
  }

  return null;
};
