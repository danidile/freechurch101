"use server";

import { createClient } from "@/utils/supabase/server";

export const getProfilesByChurch = async (churchId: unknown) => {
  const supabase = createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("church", churchId);
  const { data: tempProfiles } = await supabase
    .from("temp-profiles")
    .select("*")
    .eq("church", churchId);

  if (profiles && tempProfiles) {
    // Unisci le due liste
    const updatedTempProfiles = tempProfiles.map((profile) => ({
      ...profile,
      isTemp: true,
    }));
    const allprofiles = [...profiles, ...updatedTempProfiles];

    const sortedProfiles = allprofiles.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    // console.log("sortedProfiles");
    // console.log(sortedProfiles);
    return sortedProfiles;
  }
};
