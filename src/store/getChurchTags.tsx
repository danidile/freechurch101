import { createClient } from "@/utils/supabase/client";

export default async function getChurchTags(churchId: string) {
  const supabase = createClient();

  const { data: data, error } = await supabase
    .from("tags")
    .select("tags")
    .eq("church", churchId)
    .single();
  if (error) {
    console.log("Error in selection church tags");
  }
  const tags: string[] = data.tags;
  console.log("tags", tags);
  return tags;
}
