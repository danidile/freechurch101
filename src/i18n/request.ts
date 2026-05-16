import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { headers } from "next/headers";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    const headersList = await headers();
    const headerLocale = headersList.get("x-next-intl-locale");

    if (headerLocale && routing.locales.includes(headerLocale as any)) {
      locale = headerLocale;
    } else {
      locale = routing.defaultLocale;
    }
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
