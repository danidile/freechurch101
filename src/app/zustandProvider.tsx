"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";

export function ZustandProviders({ children }: { children: React.ReactNode }) {
  const { userData, fetchUser, loading } = useUserStore();

  useEffect(() => {
    if (!userData && !loading) {
      fetchUser();
    }
  }, [userData, loading]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <img
          className="max-h-12 overflow-visible"
          src="/images/brand/LOGO_.png"
          alt=""
        />
      </div>
    );
  }

  return <>{children}</>;
}
