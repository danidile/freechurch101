"use server";

import { createClient } from "@/utils/supabase/server";

export const getChurches = async () => {
  const supabase = await createClient();
  const { data: churches } = await supabase
    .from("churches")
    .select("id , church_name, pastor, address,provincia, city");
  const churchList = [];
  if (churches) {
    let church;
    for (let i = 0; i < churches.length; i++) {
      church = {
        id: churches[i].id,
        churchName: churches[i].church_name,
        pastor: churches[i].pastor,
        address: churches[i].address,
        provincia: churches[i].provincia,
        city: churches[i].city,
      };
      churchList.unshift(church);
    }
  }
  return churchList;
};
