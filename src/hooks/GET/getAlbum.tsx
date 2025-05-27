"use server";

import { createClient } from "@/utils/supabase/server";

export const getAlbum = async (artist: string) => {
  const supabase = createClient();
  const { data: albums, error } = await supabase
    .from("global-songs")
    .select("*,album(album_name)")
    .eq("artist", artist);

  if (error) {
    console.error(error);
  } else {
    const groupedByAlbum = albums.reduce(
      (acc, song) => {
        const albumName = song.album?.album_name || "Unknown Album";
        if (!acc[albumName]) {
          acc[albumName] = [];
        }
        acc[albumName].push(song);
        return acc;
      },
      {} as Record<string, typeof albums>
    );
    return groupedByAlbum;
  }

  return null;
};
