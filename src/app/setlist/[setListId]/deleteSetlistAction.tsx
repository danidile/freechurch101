"use server";

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";

interface Setlist {
  id: string;
  church: { church_name: string }[]; // nested object from the `church` table
  date: Date; // or `Date` if it's a date object
}

export const deleteSetList = async (setlistId: string) => {
  const supabase = await createClient();
  console.log(setlistId);

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
      "/setlist",
      "SetList eliminata con successo!"
    );
  }
};
