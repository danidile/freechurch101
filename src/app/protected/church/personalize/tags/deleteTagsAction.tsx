"use server";
import { createClient } from "@/utils/supabase/server";
import { TagWithDescription } from "@/utils/types/types";

const deleteTagsAction = async (
  tags: TagWithDescription[],
  churchId: string
) => {
  const supabase = createClient();

  // Extract IDs from the tags to delete
  const idsToDelete = tags.map((tag) => tag.id).filter(Boolean);

  if (idsToDelete.length === 0) {
    return {
      success: false,
      error: "No valid tag IDs to delete.",
    };
  }

  // Delete tags where church = churchId and id is in idsToDelete
  const { error } = await supabase
    .from("tags")
    .delete()
    .eq("church", churchId)
    .in("id", idsToDelete);

  if (error) {
    console.error("Error deleting tags:", error);
    return {
      success: false,
      error: error.message,
    };
  }
  console.error("Tags delete successfully");

  return {
    success: true,
  };
};

export default deleteTagsAction;
