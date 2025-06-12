"use server";

import { createClient } from "@/utils/supabase/server";

export const getProfilesByChurch = async (churchId: unknown) => {
  const supabase = createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("church", churchId);

  if (profiles) {
    // Unisci le due liste

    const sortedProfiles = profiles.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return sortedProfiles;
  }
};
