"use server";

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { getLocale } from "next-intl/server";

export const deleteSetList = async (setlistId: string) => {
  const supabase = await createClient();
  const locale = await getLocale();

  const { error: setlistSongsError } = await supabase
    .from("setlist-songs")
    .delete()
    .eq("setlist_id", setlistId);

  const { error: setlistError } = await supabase
    .from("setlist")
    .delete()
    .eq("id", setlistId);

  if (setlistError || setlistSongsError) {
    console.error("Error deleting rows:", setlistError || setlistSongsError);
  } else {
    console.log("Rows deleted successfully");
    return encodedRedirect(
      "success",
      `/${locale}/setlist`,
      "SetList eliminata con successo!",
    );
  }
};
