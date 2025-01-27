import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Next.js PWA',
    short_name: 'CCLab',
    description: 'A Progressive Web App built with Next.js',
    start_url: '/',
    display: 'fullscreen',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/images/brand/logo192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/brand/logo512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}