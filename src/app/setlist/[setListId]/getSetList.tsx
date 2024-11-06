"use server";

import { createClient } from "@/utils/supabase/server";

export const getSetList = async (setlistId: unknown) => {
  const supabase = createClient();
  const { data, error } = await supabase
  .from('setlist')
  .select(" id, church(church_name), date")
  .eq('id', setlistId) ;
  if(error){
    console.log(error)
  }else{
    console.log(data);
    return data;
  }
  };