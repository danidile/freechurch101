"use server";

import { createClient } from "@/utils/supabase/server";

type ProfilesRow = {
  church: string; // attenzione: array
};
type SupabaseResponse = {
  data: ProfilesRow | null;
  error: Error | null; // Add error here
};

export const getChurchMembersCount = async (): Promise<number | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = (await supabase
    .from("profiles")
    .select("church")
    .eq("id", user.id)
    .single()) as unknown as SupabaseResponse;

  if (error) {
    console.error("Error fetching CustomerID:", error);
    return null;
  } else {
    const { count, error } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("church", data?.church);

    console.log("Profiles in this church:", count);
    return count;
  }
};
