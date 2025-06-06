"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./sidebar";
import { useUserStore } from "@/store/useUserStore";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userData, loading, fetchUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!userData.loggedIn && !loading) {
      fetchUser().then(() => {
        if (!useUserStore.getState().userData.loggedIn) {
          router.push("/login");
        }
      });
    }
  }, [userData.loggedIn, loading]);

  if (loading || !userData.loggedIn) {
    return <p>Loading...</p>; // Or a skeleton/loading component
  }

  return (
    <div className="flex flex-row">
      <Sidebar userData={userData} />
      <div className="dashboard-container">{children}</div>
    </div>
  );
}
