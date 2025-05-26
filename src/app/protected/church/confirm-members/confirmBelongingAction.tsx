"use server";

import fbasicUserData from "@/utils/supabase/getUserData";
import { createClient } from "@/utils/supabase/server";
import { basicUserData } from "@/utils/types/userData";
import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/dist/server/api-utils";

export const confirmBelongingAction = async (profileId: string) => {
  const supabase = createClient();
  const userData: basicUserData = await fbasicUserData();

  // Confirm church to profile
  const { data, error } = await supabase
    .from("profiles")
    .update({ church: userData.church_id })
    .eq("id", profileId)
    .select();
  // DELETE Request to belong to church
  // only if insert was successfull
  if (error) {
    console.log(error);
  } else {
    const { error: errorDelete } = await supabase
      .from("church-membership-request")
      .delete()
      .eq("profile", profileId);
    if (errorDelete) {
      console.log(errorDelete);
    }
  }

  return encodedRedirect(
    "success",
    "/protected/dashboard",
    "Profilo aggiunto con successo"
  );
};
