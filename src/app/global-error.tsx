"use client";

import { logEventClient } from "@/utils/supabase/logClient";
import NextError from "next/error";
import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      // Skip logging in development
      return;
    }

    // Log the error
    logEventClient({
      event: "global_error",
      level: "error",
      meta: {
        message: error.message,
        stack: error.stack,
        path: window.location.pathname,
      },
    });

    // Optionally, you can reset or redirect after a delay
    // setTimeout(() => reset(), 5000);
  }, [error]);

  return (
    <html>
      <body>
        {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
        <div className="container-sub">
          <p>Errore</p>
          <Link href={"/"}>Clicca qui per ritornare alla Homepage</Link>
        </div>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
