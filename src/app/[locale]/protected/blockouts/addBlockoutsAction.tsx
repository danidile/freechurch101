"use server";
import { createClient } from "@/utils/supabase/server";
import { RangeValueString } from "@/utils/types/types";
import { logEvent } from "@/utils/supabase/log";

export const addBlockoutAction = async ({
  blockedDates,
}: {
  blockedDates: RangeValueString;
}) => {
  console.log("blockedDates", blockedDates);
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("No user found", userError);
    await logEvent({
      event: "add_blockout_error",
      level: "error",
      user_id: null,
      meta: {
        message: userError?.message ?? "No user found",
        context: "blockout insert",
      },
    });
    return;
  }

  blockedDates.profile = user.id;

  const { error: insertError } = await supabase
    .from("blockouts")
    .insert(blockedDates)
    .select();

  if (insertError) {
    console.error("Upsert error", insertError);
    await logEvent({
      event: "add_blockout_error",
      level: "error",
      user_id: user.id,
      meta: {
        message: insertError.message,
        code: insertError.code,
        context: "blockout insert",
      },
    });
  }
};
