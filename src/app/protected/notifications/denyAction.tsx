"use server";
import { setListT } from "@/utils/types/types";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";

export const denyAction = async (formId: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("event-team")
    .update({ status: "confirmed" })
    .eq("id", formId)
    .select();
  if (error) {
    console.log(error);
  }else{
    console.log(data);
  }
};
