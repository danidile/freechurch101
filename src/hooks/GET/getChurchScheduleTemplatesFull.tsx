"use client";

import { createClient } from "@/utils/supabase/client";
import { getScheduleTemplateById } from "./getScheduleTemplateById";

export const getChurchScheduleTemplatesFull = async (churchId: string) => {
  const supabase = await createClient();

  const { data: Schedules, error } = await supabase
    .from("schedule-template")
    .select("*")
    .eq("church", churchId);

  if (error) {
    console.error("Errore durante il fetch:", error);
    return [];
  }

  if (Schedules.length >= 1) {
    const schedulesFull = await Promise.all(
      Schedules.map(async (s) => {
        const response = await getScheduleTemplateById(s.id);
        return response;
      })
    );
    return schedulesFull;
  }

  return [];
};
