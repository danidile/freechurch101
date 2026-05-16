"use server";

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";

export const confirmBelongingAction = async (profileId: string) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // GET profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  const { data, error } = await supabase
    .from("profiles")
    .update({ church: profile.church, role: 8 })
    .eq("id", profileId)
    .select();
  console.log("profileId", profileId);

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
    "/protected/dashboard/account",
    "Profilo aggiunto con successo"
  );
};
