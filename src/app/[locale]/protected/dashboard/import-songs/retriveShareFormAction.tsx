"use server";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";

export const retriveShareFormAction = async function viewChurchSongsShareList(
  shareCode: string
) {
  const supabase = await createClient();

  let { data: churchShareCode, error } = await supabase
    .from("church-share-code")
    .select("*")
    .eq("code", shareCode);

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect(
      "error",
      "/protected/dashboard/import-songs",
      "Codice errato"
    );
  } else {
    if (churchShareCode.length > 0) {
      return encodedRedirect(
        "success",
        `/protected/dashboard/import-songs/view-church-share-songs`,
        shareCode
      );
    } else {
      return encodedRedirect(
        "error",
        "/protected/dashboard/import-songs",
        "Codice errato"
      );
    }
  }
};
