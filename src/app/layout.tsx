import type { Metadata } from "next";
import "./globals.css";
import MenuBar from "./components/navbar";
import { Viewport } from "next";

export const metadata = {
  title: "ChurchLab",
  description: "Dai struttura alla tua chiesa",
  // appleWebApp: {
  //   capable: true,
  //   statusBarStyle: "black-translucent",
  //   // PWAs generates on https://mittl-medien.de/pwa-asset-generator
  //   startupImage: [
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-2048-2732.jpg",
  //       media:
  //         "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-2732-2048.jpg",
  //       media:
  //         "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-1668-2388.jpg",
  //       media:
  //         "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-2388-1668.jpg",
  //       media:
  //         "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-1536-2048.jpg",
  //       media:
  //         "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-2048-1536.jpg",
  //       media:
  //         "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-1488-2266.jpg",
  //       media:
  //         "(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-2266-1488.jpg",
  //       media:
  //         "(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-1640-2360.jpg",
  //       media:
  //         "(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-2360-1640.jpg",
  //       media:
  //         "(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-1668-2224.jpg",
  //       media:
  //         "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-2224-1668.jpg",
  //       media:
  //         "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-1620-2160.jpg",
  //       media:
  //         "(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-2160-1620.jpg",
  //       media:
  //         "(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-1290-2796.jpg",
  //       media:
  //         "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-2796-1290.jpg",
  //       media:
  //         "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-1179-2556.jpg",
  //       media:
  //         "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-2556-1179.jpg",
  //       media:
  //         "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-1284-2778.jpg",
  //       media:
  //         "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-2778-1284.jpg",
  //       media:
  //         "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-1170-2532.jpg",
  //       media:
  //         "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-2532-1170.jpg",
  //       media:
  //         "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-1125-2436.jpg",
  //       media:
  //         "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-2436-1125.jpg",
  //       media:
  //         "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-1242-2688.jpg",
  //       media:
  //         "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-2688-1242.jpg",
  //       media:
  //         "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-828-1792.jpg",
  //       media:
  //         "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-1792-828.jpg",
  //       media:
  //         "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-1242-2208.jpg",
  //       media:
  //         "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-2208-1242.jpg",
  //       media:
  //         "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-750-1334.jpg",
  //       media:
  //         "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-1334-750.jpg",
  //       media:
  //         "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-640-1136.jpg",
  //       media:
  //         "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  //     },
  //     {
  //       url: "/images/brand/PWA-icons/apple-splash-1136-640.jpg",
  //       media:
  //         "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
  //     },
  //   ],
  // },
};

export const viewport: Viewport = {
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Add DM SANS font */}

        {/* PWA Icons Splash */}
        {/* <link
          href="/images/brand/PWA-icons/apple-icon-180.png"
          rel="apple-touch-icon"
          sizes="180x180"
        />
        <link
          href="/images/brand/PWA-icons/apple-splash-2048-2732.png"
          rel="apple-touch-startup-image"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          href="/images/brand/PWA-icons/apple-splash-2732-2048.jpg"
          rel="apple-touch-startup-image"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        />
        <link
          href="/images/brand/PWA-icons/apple-splash-1668-2388.jpg"
          rel="apple-touch-startup-image"
          media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          href="/images/brand/PWA-icons/apple-splash-2388-1668.jpg"
          rel="apple-touch-startup-image"
          media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        />
        <link
          href="/images/brand/PWA-icons/apple-splash-1536-2048.jpg"
          rel="apple-touch-startup-image"
          media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          href="/images/brand/PWA-icons/apple-splash-2048-1536.jpg"
          rel="apple-touch-startup-image"
          media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        />
        <link
          href="/images/brand/PWA-icons/apple-splash-1668-2224.jpg"
          rel="apple-touch-startup-image"
          media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          href="/images/brand/PWA-icons/apple-splash-2224-1668.jpg"
          rel="apple-touch-startup-image"
          media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        />
        <link
          href="/images/brand/PWA-icons/apple-splash-1620-2160.jpg"
          rel="apple-touch-startup-image"
          media="(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          href="/images/brand/PWA-icons/apple-splash-2160-1620.jpg"
          rel="apple-touch-startup-image"
          media="(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        />
        <link
          href="/images/brand/PWA-icons/apple-splash-1284-2778.jpg"
          rel="apple-touch-startup-image"
          media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          href="/images/brand/PWA-icons/apple-splash-2778-1284.jpg"
          rel="apple-touch-startup-image"
          media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
        />
        <link
          href="/images/brand/PWA-icons/apple-splash-1170-2532.jpg"
          rel="apple-touch-startup-image"
          media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          href="/images/brand/PWA-icons/apple-splash-2532-1170.jpg"
          rel="apple-touch-startup-image"
          media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
        />
        <link
          href="/images/brand/PWA-icons/apple-splash-1125-2436.jpg"
          rel="apple-touch-startup-image"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          href="/images/brand/PWA-icons/apple-splash-2436-1125.jpg"
          rel="apple-touch-startup-image"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
        />
        <link
          href="/images/brand/PWA-icons/apple-splash-1242-2688.jpg"
          rel="apple-touch-startup-image"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          href="/images/brand/PWA-icons/apple-splash-2688-1242.jpg"
          rel="apple-touch-startup-image"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
        />
        <link
          href="/images/brand/PWA-icons/apple-splash-828-1792.jpg"
          rel="apple-touch-startup-image"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          href="/images/brand/PWA-icons/apple-splash-1792-828.jpg"
          rel="apple-touch-startup-image"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        />
        <link
          href="/images/brand/PWA-icons/apple-splash-1242-2208.jpg"
          rel="apple-touch-startup-image"
          media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          href="/images/brand/PWA-icons/apple-splash-2208-1242.jpg"
          rel="apple-touch-startup-image"
          media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
        />
        <link
          href="/images/brand/PWA-icons/apple-splash-750-1334.jpg"
          rel="apple-touch-startup-image"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          href="/images/brand/PWA-icons/apple-splash-1334-750.jpg"
          rel="apple-touch-startup-image"
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        />
        <link
          href="/images/brand/PWA-icons/apple-splash-640-1136.jpg"
          rel="apple-touch-startup-image"
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          href="/images/brand/PWA-icons/apple-splash-1136-640.jpg"
          rel="apple-touch-startup-image"
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        /> */}

        {/* END of PWA Icons Splash */}

        <link rel="icon" href="/images/brand/cropped-Fav-2.png" sizes="48x48" />
        <link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml" />

        <link rel="icon" href="/images/brand/cropped-Fav-2.png" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300..700;1,300..700&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap"
          rel="stylesheet"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300..700;1,300..700&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>
      <body>
        <MenuBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
