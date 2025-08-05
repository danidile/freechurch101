"use server";

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";



export const deleteScheduleTemplateAction = async (scheduleId: string) => {
  const supabase = await createClient();

  const { error: setlistSongsError } = await supabase
    .from("schedule-template")
    .delete()
    .eq("id", scheduleId);

  if (setlistSongsError) {
    console.error("Error deleting rows:", setlistSongsError);
  } else {
    console.log("Rows deleted successfully");
    return encodedRedirect(
      "success",
      "/protected/church/personalize/schedule-template/",
      "schedule template eliminata con successo!"
    );
  }
};
