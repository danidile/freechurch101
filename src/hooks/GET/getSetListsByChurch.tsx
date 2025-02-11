"use server";

import { createClient } from "@/utils/supabase/server";

export const getSetListsByChurch = async (churchId: string) => {
  const supabase = createClient();
  const { data:setlist, error } = await supabase
    .from("setlist")
    .select('id,event_title,date')
    .eq("church", churchId);

    if (error) {
      console.error("Error fetching setlist:", error);
      return null;
    }


  
    console.log(setlist);
    return setlist;
  
};
