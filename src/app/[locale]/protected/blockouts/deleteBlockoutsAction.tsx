"use server";
import { createClient } from "@/utils/supabase/server";
import { logEvent } from "@/utils/supabase/log";

export const deleteBlockoutAction = async ({
  blockId,
}: {
  blockId: string;
}) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("No user found", userError);
    await logEvent({
      event: "delete_blockout_error",
      level: "error",
      user_id: null,
      meta: {
        message: userError?.message ?? "No user found",
        context: "blockout delete",
      },
    });
    return;
  }

  const { error } = await supabase.from("blockouts").delete().eq("id", blockId);

  if (error) {
    console.error("delete blockouts error", error);
    await logEvent({
      event: "delete_blockout_error",
      level: "error",
      user_id: user.id,
      meta: {
        message: error.message,
        code: error.code,
        context: "blockout delete",
      },
    });
  }
};
