"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { usePathname, useRouter } from "next/navigation";

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
