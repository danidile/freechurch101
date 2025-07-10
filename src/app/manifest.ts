import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Church Lab",
    short_name: "Church Lab",
    description: "A Progressive Web App built with Next.js",
    start_url: "/songs",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/images/brand/logo192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/brand/logo512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
