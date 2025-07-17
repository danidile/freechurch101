"use server";

import { createClient } from "@/utils/supabase/server";

export const getTeamMembersCompact = async (churchId: string) => {
  const supabase = await createClient();
  const { data: teamMembers, error } = await supabase
    .from("profiles")
    .select("id,name, lastname,email,author")
    .eq("id", churchId);

  return teamMembers;
};
