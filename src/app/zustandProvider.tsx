"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";

export function ZustandProviders({ children }: { children: React.ReactNode }) {
  const { userData, fetchUser, loading } = useUserStore();

  useEffect(() => {
    if (!userData.fetched && !loading) {
      fetchUser();
    }
  }, [userData?.fetched, loading]);

  return <>{children}</>;
}
