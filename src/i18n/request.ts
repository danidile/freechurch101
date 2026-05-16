import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import path from "path";
import fs from "fs";
import { cookies } from "next/headers";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    // read from the NEXT_LOCALE cookie that next-intl sets
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;

    if (cookieLocale && routing.locales.includes(cookieLocale as any)) {
      locale = cookieLocale;
    } else {
      locale = routing.defaultLocale;
    }
  }

  const messagesPath = path.join(process.cwd(), "messages", `${locale}.json`);
  const messages = JSON.parse(fs.readFileSync(messagesPath, "utf-8"));

  return { locale, messages };
});
