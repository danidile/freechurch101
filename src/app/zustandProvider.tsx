"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useChurchStore } from "@/store/useChurchStore";

export function ZustandProviders({ children }: { children: React.ReactNode }) {
  const { userData, fetchUser, loading } = useUserStore();
  const { fetchChurchData } = useChurchStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!userData && !loading) {
      fetchUser();
    }
  }, [userData, loading]);

  useEffect(() => {
    if (userData && userData.church_id) {
      fetchChurchData(userData.church_id, userData.role);
    }
  }, [userData]);

  return (
    <>
      {/* ✅ Only show overlay after mount (client-only), avoids hydration mismatch */}
      {mounted && (loading || !userData) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
          <img
            className="max-h-12 overflow-visible"
            src="/images/brand/LOGO_.png"
            alt=""
          />
        </div>
      )}
      {children}
    </>
  );
}
