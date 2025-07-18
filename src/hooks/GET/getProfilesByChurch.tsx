"use server";

import { createClient } from "@/utils/supabase/server";

export const getProfilesByChurch = async (churchId: unknown) => {
  const supabase = await createClient();

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("church", churchId);

  if (error || !profiles) {
    console.error("Error fetching profiles:", error);
    return [];
  }

  const sortedProfiles = profiles.sort((a, b) => {
    // First by role ascending (1 to 9)
    if (a.role !== b.role) return a.role - b.role;

    // Then by name alphabetically
    return a.name.localeCompare(b.name);
  });

  return sortedProfiles;
};
