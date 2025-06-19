"use server";
import { createClient } from "@/utils/supabase/server";
import { GroupedMembers } from "@/utils/types/types";

import { churchMembersT, registrationData } from "@/utils/types/types";

export default async function updateLastReminderSupabase(
  item: churchMembersT,
  team: string,
  readableDate: string,
  setlistId: string
) {
  const today = new Date();

  const supabase = createClient();
  const { data, error } = await supabase
    .from("event-team")
    .update({ last_email: today })

    .eq("id", item.id);

  if (error) {
    console.log(error);
    return error.message;
  } else {
    return "Last_email Updated";
  }
}
