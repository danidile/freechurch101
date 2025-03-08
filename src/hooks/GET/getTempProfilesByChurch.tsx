"use server";

import { createClient } from "@/utils/supabase/server";

export const getTempProfilesByChurch = async (churchId: unknown) => {
  const supabase = createClient();
  const { data: tempProfiles } = await supabase
    .from("temp-profiles")
    .select("*")
    .eq("church", churchId);

  if (tempProfiles) {
    const sortedProfiles = tempProfiles.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    // console.log("sortedProfiles");
    // console.log(sortedProfiles);
    return sortedProfiles;
  }
};
