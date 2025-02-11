"use server";

import { createClient } from "@/utils/supabase/server";
import { PostgrestResponse } from "@supabase/supabase-js";

interface Setlist {
  id: string;
  church: { church_name: string }[]; // nested object from the `church` table
  date: Date; // or `Date` if it's a date object
}

export const getSetList = async (setlistId: unknown) => {
  type SetlistResponse = PostgrestResponse<Setlist>;
  const supabase = createClient();
  const { data, error }: SetlistResponse = await supabase
    .from("setlist")
    .select("id, church(church_name), date,event_title")
    .eq("id", setlistId)
    .single();

  if (error) {
    console.log(error);
  } else {
    // console.log(data);
    return data;
  }
};
