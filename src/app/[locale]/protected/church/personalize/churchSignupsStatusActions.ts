"use server";

import { createClient } from "@/utils/supabase/server";

export async function updateChurchField(
  churchId: string,
  field: "accepting_signups",
  value: boolean,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("auth user:", user?.id); // 👈 check this is not null

  const { data, error } = await supabase
    .from("churches") // 👈 fixed: your table is "churches" not "church"
    .update({ [field]: value })
    .eq("id", churchId)
    .select();

  console.log("result:", { data, error });

  if (error) throw new Error(`${error.message} | ${error.code}`);
  if (!data || data.length === 0) throw new Error(`No rows updated`);
}
