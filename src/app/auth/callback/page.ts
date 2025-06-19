"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const exchange = async () => {
      const code = searchParams.get("code");
      const redirectTo = searchParams.get("redirect_to") || "/";

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          router.replace(redirectTo);
        } else {
          console.error("Session exchange error:", error.message);
          router.replace("/auth/auth-code-error");
        }
      }
    };

    exchange();
  }, []);
}
