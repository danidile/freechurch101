import { createClient } from "@/utils/supabase/client";
import { TagWithDescription } from "@/utils/types/types";

export default async function getChurchTags(
  churchId: string
): Promise<TagWithDescription[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tags")
    .select("id,name,description")
    .eq("church", churchId);

  if (error || !data) {
    console.error("Error fetching church tags:", error?.message);
    return []; // oppure null se preferisci
  }

  return data;
}
