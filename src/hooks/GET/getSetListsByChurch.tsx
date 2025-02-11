"use server";

import fbasicUserData from "@/utils/supabase/getUserData";
import { createClient } from "@/utils/supabase/server";
import { basicUserData } from "@/utils/types/userData";
import { PostgrestResponse } from "@supabase/supabase-js";
import { error } from "console";

export const getSetListsByChurch = async (churchId: unknown) => {
  
    const supabase = createClient();
    const { data: setlist, error } = await supabase
      .from("setlist")
      .select('id, church("church_name"),event_title,date')
      .eq("church", churchId);

    if (error) {
      console.log(error);
    } else {
      // console.log(data);
      return setlist;
    }
  
};
