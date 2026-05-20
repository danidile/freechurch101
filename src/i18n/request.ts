import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { headers } from "next/headers";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    // read from x-next-url or x-invoke-path header
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "";
    const segments = pathname.split("/").filter(Boolean);
    const urlLocale = segments[0];

    if (urlLocale && routing.locales.includes(urlLocale as any)) {
      locale = urlLocale;
    } else {
      locale = routing.defaultLocale;
    }
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
