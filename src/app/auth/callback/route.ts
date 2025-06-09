// /auth/callback/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
const next = searchParams.get("redirect_to") ?? "/";

  if (code) {
    const supabase = createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocal = process.env.NODE_ENV === "development";

      const finalRedirect = isLocal
        ? `${origin}${next}`
        : forwardedHost
          ? `https://${forwardedHost}${next}`
          : `${origin}${next}`;

      return NextResponse.redirect(finalRedirect);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
