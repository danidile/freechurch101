"use server";
import { createClient } from "@/utils/supabase/server";
export const getSetList = async (setlistId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("setlist")
    .select("id, date, event_type,private,color")
    .eq("id", setlistId)
    .single();
  if (error) {
    console.log(error);
  } else {
    return data;
  }
};
