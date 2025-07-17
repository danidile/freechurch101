"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default async function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const redirectTo = searchParams.get("redirect_to") || "/";

    // ✅ Skip exchangeCodeForSession — Supabase already logged in the user
    router.replace(redirectTo);
  }, []);
}
