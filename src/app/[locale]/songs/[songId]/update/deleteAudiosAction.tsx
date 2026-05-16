"use server";

import { createClient } from "@/utils/supabase/server";

export const deleteAudiosAction = async (paths: string[]) => {
  if (!paths || paths.length === 0) {
    throw new Error("No file paths provided for deletion");
  }

  const supabase = await createClient();
  const { error } = await supabase.storage.from("churchdata").remove(paths);

  if (error) {
    console.error("Error deleting audio files:", error);
    return { success: false, error: error.message };
  }

  console.log("Audio files deleted successfully:", paths);
  return { success: true };
};
