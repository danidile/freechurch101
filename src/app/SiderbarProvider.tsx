"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useChurchStore } from "@/store/useChurchStore";
import Sidebar from "./protected/sidebar";
import UserDataMenu from "./components/userDataMenu";

export function SiderbarProvider({ children }: { children: React.ReactNode }) {
  const { userData } = useUserStore();

  if (userData.loggedIn) {
    return (
      <div className="flex flex-row relative">
        <div className="hidden md:block sidebar-container relative">
          <Sidebar />
        </div>
        <div className="dashboard-container">
          <div className="w-full max-w-[1300px] mx-auto">
            <UserDataMenu />
          </div>
          {children}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
