"use client";

import { createClient } from "@/utils/supabase/client";

export async function getAllChurchFiles(churchId: string) {
  const allFiles: any[] = [];
  const supabase = createClient();
  async function listRecursive(path: string) {
    const { data, error } = await supabase.storage
      .from("churchdata")
      .list(path, { limit: 100, offset: 0 });

    if (error) {
      console.error("Error listing files:", error.message);
      return;
    }

    for (const item of data || []) {
      if (item.name === ".emptyFolderPlaceholder") continue;

      const fullPath = path ? `${path}/${item.name}` : item.name;

      if (item.metadata && item.metadata.size !== undefined) {
        // È un file
        allFiles.push({
          name: item.name,
          fullPath,
        });
      } else {
        // È una cartella: ricorsione
        await listRecursive(fullPath);
      }
    }
  }

  await listRecursive(churchId);

  return allFiles;
}
