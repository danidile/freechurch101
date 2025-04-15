"use server";

import fbasicUserData from "@/utils/supabase/getUserData";
import { createClient } from "@/utils/supabase/server";
import { basicUserData } from "@/utils/types/userData";

export const getShareCode = async () => {
  const supabase = createClient();
  const userData: basicUserData = await fbasicUserData();
  console.log("userData");
  console.log(userData.church_id);
  const { data: shareCode } = await supabase
    .from("church-share-code")
    .select("code")
    .eq("church", userData.church_id)
    .single();
  console.log("shareCode");
  console.log(shareCode.code);

  return shareCode?.code || "";
};
