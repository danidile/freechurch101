import { NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // extract locale from pathname
  const pathname = request.nextUrl.pathname;
  const localeFromPath = pathname.split("/")[1];
  const locale = routing.locales.includes(localeFromPath as any)
    ? localeFromPath
    : routing.defaultLocale;

  // clone the request and add locale header so request.ts can read it
  const requestWithLocale = new NextRequest(request.url, {
    headers: new Headers({
      ...Object.fromEntries(request.headers.entries()),
      "x-next-intl-locale": locale,
    }),
    method: request.method,
  });

  const intlResponse = intlMiddleware(requestWithLocale);

  if (intlResponse.status !== 200) {
    return intlResponse;
  }

  const supabaseResponse = await updateSession(requestWithLocale);

  if (supabaseResponse.status !== 200) {
    return supabaseResponse;
  }

  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie);
  });

  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/stripe/webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
