"use server";
import { createClient } from "@/utils/supabase/server";

const upsertTagsAction = async (tags: string[], churchId: string) => {
  const supabase = createClient();
  let { data: churchTags, error } = await supabase
    .from("tags")
    .select("*")
    .eq("church", churchId);
  if (error) {
    console.error("Error fetching tags:", error);
  } else if (churchTags && churchTags.length > 0) {
    console.log("Tags found:", churchTags);
    const { data, error } = await supabase
      .from("tags")
      .update({ tags })
      .eq("church", churchId)
      .select();
  } else {
    console.log("No tags found for this church.");
    const { data, error } = await supabase
      .from("tags")
      .insert([
        {
          church: churchId,
          tags,
        },
      ])
      .select();
    if (error) {
      console.log(error);
    }
  }
};

export default upsertTagsAction;
