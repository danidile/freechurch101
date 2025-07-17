"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useChurchStore } from "@/store/useChurchStore";
import Sidebar from "./protected/sidebar";
import UserDataMenu from "./components/userDataMenu";

export function SiderbarProvider({ children }: { children: React.ReactNode }) {
  const { userData } = useUserStore();
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

  if (userData.loggedIn) {
    return (
      <div className="flex flex-row relative">
        <div className="hidden md:block sidebar-container relative">
          <Sidebar />
        </div>
        <div className="dashboard-container">
          {!isStandalone && (
            <div className="w-full max-w-[1300px] mx-auto block">
              <UserDataMenu />
            </div>
          )}
          {children}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
