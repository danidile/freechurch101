import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation"; // ← back to next/navigation
import { routing } from "@/i18n/routing";
import { Viewport } from "next";
import { ZustandProviders } from "../zustandProvider";
import { ToastProvider } from "@heroui/toast";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SiderbarProvider } from "../SiderbarProvider";
import MenuBar from "./components/navbar";
import FooterCL from "./components/footer";
import { Analytics } from "@vercel/analytics/next";
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) notFound();

  const messages = await getMessages({ locale });
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ZustandProviders>
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
          {children}
          {/* <SiderbarProvider></SiderbarProvider> */}
          <SpeedInsights />
          <Analytics />
        </main>
        <FooterCL />
      </ZustandProviders>
      <Analytics />
    </NextIntlClientProvider>
  );
}
