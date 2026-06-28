"use server";

import { createClient } from "@/utils/supabase/server";

export const getChurchData = async ({ churchId }: { churchId: string }) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("churches")
    .select("*")
    .eq("id", churchId)
    .single();

  return data;
};
