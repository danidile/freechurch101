"use server";

import fbasicUserData from "@/utils/supabase/getUserData";
import { createClient } from "@/utils/supabase/server";
import { basicUserData } from "@/utils/types/userData";

export const confirmAndUpdateTempUserAction = async (
  profileId: string,
  tempProfile: string
) => {
  const supabase = await createClient();
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

  const { data: teamMembersUpdate, error: teamMembersError } = await supabase
    .from("team-members")
    .update({
      profile: profileId,
    })
    .select();

  return data;
};
