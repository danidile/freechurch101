"use client";

import { createClient } from "@/utils/supabase/client";

export const getRoomsByChurch = async (churchId: string) => {
  const supabase = await createClient();

  const { data: rooms, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("church", churchId);
  if (error) {
    console.error("Errore durante il fetch:", error);
  }
  return rooms;
};
