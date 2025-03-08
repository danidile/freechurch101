"use server";

import fbasicUserData from "@/utils/supabase/getUserData";
import { createClient } from "@/utils/supabase/server";
import { basicUserData } from "@/utils/types/userData";

export const confirmBelongingAction = async (profileId: string) => {
  const supabase = createClient();
  const userData: basicUserData = await fbasicUserData();
  // Confirm church to profile
  const { data } = await supabase
    .from("profiles")
    .insert({ church: userData.id })
    .eq("id", profileId)
    .select();
  // DELETE Request to belong to church

  const { error } = await supabase
    .from("church-membership-request")
    .delete()
    .eq("profile", profileId);
  if (error) {
    console.log(error);
  }

  return data;
};
