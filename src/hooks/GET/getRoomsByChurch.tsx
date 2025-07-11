"use client";

import { createClient } from "@/utils/supabase/client";

export const getRoomsByChurch = async (churchId: string) => {
  const supabase = createClient();

  const { data: rooms, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("church", churchId);
  if (error) {
    console.error("Errore durante il fetch:", error);
  }
  console.log("rooms",rooms);
  return rooms;
};
