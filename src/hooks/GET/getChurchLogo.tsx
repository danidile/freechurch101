"use server";

import { createClient } from "@/utils/supabase/server";

export const getChurchLogo = async (churchId: string) => {
  const supabase = await createClient();
  const { data: church } = await supabase
    .from("churches")
    .select("*")
    .eq("id", churchId);

  return church;
};
