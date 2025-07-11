"use server";
import { createClient } from "@/utils/supabase/server";
import { TagWithDescription } from "@/utils/types/types";

const updateTagsAction = async (
  tags: TagWithDescription[],
  churchId: string
) => {
  const supabase = createClient();

  for (const tag of tags) {
    if (!tag.id) continue; // Skip tags without an ID

    const { error } = await supabase
      .from("tags")
      .update({
        name: tag.name,
        description: tag.description,
      })
      .eq("id", tag.id)
      .eq("church", churchId);

    if (error) {
      console.error(`Errore aggiornando il tag con ID ${tag.id}:`, error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
  console.error("Tags Updated successfully");

  return {
    success: true,
  };
};

export default updateTagsAction;
