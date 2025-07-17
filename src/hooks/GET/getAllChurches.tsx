"use server";

import { createClient } from "@/utils/supabase/server";

export const getAllChurches = async () => {
  const supabase = await createClient();
  const { data: churches } = await supabase
    .from("churches")
    .select("id , church_name");
  const churchList = [];
  if (churches) {
    let church;
    for (let i = 0; i < churches.length; i++) {
      church = {
        id: churches[i].id,
        churchName: churches[i].church_name,
      };
      churchList.unshift(church);
    }
  }
  return churchList;
};
