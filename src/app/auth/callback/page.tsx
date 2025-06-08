"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client"; // adjust path if needed

export default function AuthCallbackPage() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error retrieving session:", error.message);
        return;
      }

      const redirectPath = searchParams.get("redirect_to") || "/";
      router.replace(redirectPath);
    };

    handleAuthCallback();
  }, []);

  return <p className="text-center mt-10">Verifying your identity...</p>;
}
