"use server";
import { createClient } from "@/utils/supabase/server";
export const deleteBlockoutAction = async ({
  blockId,
}: {
  blockId: string;
}) => {
  const supabase = await createClient();

  const { error } = await supabase.from("blockouts").delete().eq("id", blockId);

  if (error) {
    console.error("delete blockouts error", error);
  }
};
