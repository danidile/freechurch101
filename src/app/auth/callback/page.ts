"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const redirectTo = searchParams.get("redirect_to") || "/";

    // ✅ Skip exchangeCodeForSession — Supabase already logged in the user
    router.replace(redirectTo);
  }, []);
}
