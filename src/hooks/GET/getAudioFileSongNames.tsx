"use client";

import { createClient } from "@/utils/supabase/client";

export const getAudioFileSongNames = async (
  bucket: string,
  folderPath: string
) => {
  const supabase = await createClient();
  const fileNames: string[] = [];
  let offset = 0;
  const limit = 1000;

  while (true) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folderPath, { limit, offset });

    if (error) {
      console.error("Error listing files:", error);
      break;
    }

    if (!data || data.length === 0) break;

    const files = data.filter((item) => item.metadata); // files only
    fileNames.push(...files.map((item) => item.name));

    if (data.length < limit) break; // end reached
    offset += limit;
  }

  return fileNames;
};
