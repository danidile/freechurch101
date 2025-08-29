"use server";

import fbasicUserData from "@/utils/supabase/getUserData";
import { createClient } from "@/utils/supabase/server";
import { basicUserData } from "@/utils/types/userData";

export const getShareCode = async () => {
  const supabase = await createClient();
  const userData: basicUserData = await fbasicUserData();
  const { data: shareCode } = await supabase
    .from("church-share-code")
    .select("code")
    .eq("church", userData.church_id)
    .single();
  return shareCode?.code || "";
};
