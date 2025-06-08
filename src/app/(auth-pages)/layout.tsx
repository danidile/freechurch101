"use client"; // Make this a client component

import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { userData, loading } = useUserStore();

  useEffect(() => {
    if (!loading && userData.loggedIn && userData.fetched) {
      router.push("/protected/dashboard/account"); // Or wherever you want to redirect
    }
  }, [loading, userData]);

  return <div className="flex flex-col gap-12 items-start">{children}</div>;
}
