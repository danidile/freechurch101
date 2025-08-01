import "@/app/globals.css";
import MenuBar from "./components/navbar";
import { Viewport } from "next";
import { ZustandProviders } from "./zustandProvider";
import { ToastProvider } from "@heroui/toast";

import { SiderbarProvider } from "./SiderbarProvider";
import NotificationButton from "../components/NotificationButton";

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
        <ZustandProviders>
          {/* <PullToRefreshLayout> */}
          <main className="pb-[120px]">

            <MenuBar />
            <ToastProvider
              placement="top-right"
              toastProps={{
                radius: "sm",
                variant: "flat",
                timeout: 10000,
                hideIcon: true,
                classNames: {
                  description: "text-gray-500 max-w-[280px]",
                  closeButton:
                    "opacity-100 absolute right-4 top-1/2 -translate-y-1/2 ml-5",
                },
                closeIcon: (
                  <svg
                    fill="none"
                    height="32"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="32"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                ),
              }}
            />
            <SiderbarProvider> {children}</SiderbarProvider>
          </main>
          {/* </PullToRefreshLayout> */}
        </ZustandProviders>
      </body>
    </html>
  );
}
