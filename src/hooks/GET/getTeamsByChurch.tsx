"use server";

import { createClient } from "@/utils/supabase/server";

export const getTeamsByChurch = async (churchId: string) => {
  const supabase = await createClient();
  let { data: churchTeams, error } = await supabase
    .from("church-teams")
    .select("id,team_name")
    .eq("church", churchId);
  if (error) {
    console.error("Error fetching setlist:", error);
    return null;
  }

  return churchTeams;
};
