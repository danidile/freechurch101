"use client";

import { createClient } from "@/utils/supabase/client";

export const getChurchScheduleTemplates = async (churchId: string) => {
  const supabase = await createClient();

  const { data: songs, error } = await supabase
    .from("schedule-template")
    .select("*")
    .eq("church", churchId);
  if (error) {
    console.error("Errore durante il fetch:", error);
  }
  return songs;
};
