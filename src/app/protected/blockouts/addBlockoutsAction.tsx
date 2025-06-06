"use server";
import { createClient } from "@/utils/supabase/server";
import { RangeValueString } from "@/utils/types/types";
export const addBlockoutAction = async ({
  blockedDates,
}: {
  blockedDates: RangeValueString;
}) => {
  console.log("blockedDates", blockedDates);
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("No user found", userError);
    return;
  }
  blockedDates.profile = user.id;

  const { error: insertError } = await supabase
    .from("blockouts")
    .insert(blockedDates)
    .select();

  if (insertError) {
    console.error("Upsert error", insertError);
  }
};
