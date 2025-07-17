"use server";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";

export const saveShareCodeAction = async function saveShareCodeAction(
  shareCode: string
) {
  const supabase = await createClient();
  const userData: basicUserData = await fbasicUserData();

  const { data, error } = await supabase
    .from("church-share-code")
    .insert([{ church: userData.church_id, code: shareCode }]);
  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/", error.message);
  } else {
    return encodedRedirect("success", `/protected/dashboard`, "");
  }
};
