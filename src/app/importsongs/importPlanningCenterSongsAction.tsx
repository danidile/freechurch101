"use server";
import { createClient } from "@/utils/supabase/server";
import { songType } from "@/utils/types/types";

export const importPlanningCenterSongsAction = async (data: songType[]) => {
  const supabase = await createClient();
  const { error } = await supabase.from("songs").insert(data).select();
  if (error) {
    console.error("Error importing songs:", error);
    return {
      success: false,
      message: error.message || "Failed to import songs",
    };
  }
  console.log("Songs imported successfully");
  return { success: true, message: "Songs imported successfully" };
};
