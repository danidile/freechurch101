import { MetadataRoute } from "next";
import { createClient } from "@/utils/supabase/server"; // Adjust path if needed

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://churchlab.it";
  const supabase = createClient();

  const { data: italianSongs, error } = await supabase
    .from("italian-songs")
    .select("id");

  console.log("SITEMAP SONGS:", italianSongs, error);
  if (error) {
    console.error("Error fetching songs for sitemap:", error);
    return [];
  }

  const staticRoutes = ["", "about", "contact"].map((path) => ({
    url: `${baseUrl}/${path}`,
    lastModified: new Date().toISOString(),
  }));

  const songRoutes = italianSongs.map((song) => ({
    url: `${baseUrl}/italiansongs/${song.id}`,
    lastModified: new Date().toISOString(),
  }));

  return [...staticRoutes, ...songRoutes];
}
