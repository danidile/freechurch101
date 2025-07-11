"use server";
import { createClient } from "@/utils/supabase/server";
import { TagWithDescription } from "@/utils/types/types";

const insertTagsAction = async (
  tags: TagWithDescription[],
  churchId: string
) => {
  const supabase = createClient();
  const formattedTags = tags.map((tag) => {
    return {
      church: churchId,
      name: tag.name,
      description: tag.description,
    };
  });
  const { data, error } = await supabase
    .from("tags")
    .insert(formattedTags)
    .select();

  if (error) {
    console.log(error);
    return {
      success: false,
      error: error.message,
    };
  } else {
    console.log("tag aggiunto con successo");
    return {
      success: true,
    };
  }
};

export default insertTagsAction;
