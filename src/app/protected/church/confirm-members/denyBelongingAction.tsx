"use server";

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";

export const denyBelongingAction = async (profileId: string) => {
  const supabase = createClient();

  const { error: errorDelete } = await supabase
    .from("church-membership-request")
    .delete()
    .eq("profile", profileId);
  if (errorDelete) {
    console.log(errorDelete);
  }

  return encodedRedirect(
    "success",
    "/protected/dashboard/account",
    "Richiesta membership eliminata con successo"
  );
};
