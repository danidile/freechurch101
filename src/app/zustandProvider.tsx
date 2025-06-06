"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";

export function ZustandProviders({ children }: { children: React.ReactNode }) {
  const { userData, fetchUser } = useUserStore();
  useEffect(() => {
    // Fetch user data on mount if not logged in yet
    if (!userData?.loggedIn) {
      fetchUser();
    }
  }, [userData?.loggedIn, fetchUser]);

  return <>{children}</>;
}
