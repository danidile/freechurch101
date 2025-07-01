"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useChurchStore } from "@/store/useChurchStore";

export function ZustandProviders({ children }: { children: React.ReactNode }) {
  const { userData, fetchUser, loading } = useUserStore();
  const { fetchChurchData } = useChurchStore();

  useEffect(() => {
    if (!userData && !loading) {
      fetchUser();
    }
  }, [userData, loading]);

  useEffect(() => {
    if (userData && userData.church_id) {
      fetchChurchData(userData.church_id);
    }
  }, [userData]);
  if (loading || !userData) {
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
