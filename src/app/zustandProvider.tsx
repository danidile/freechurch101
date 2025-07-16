"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useChurchStore } from "@/store/useChurchStore";
declare global {
  interface Navigator {
    standalone?: boolean;
  }
}
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
      fetchChurchData(userData.church_id, userData.role);
    }
  }, [userData]);
  useEffect(() => {
    function detectDisplayMode() {
      document.documentElement.classList.remove(
        "standalone",
        "fullscreen",
        "browser"
      );

      if (
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone // now recognized by TS
      ) {
        document.documentElement.classList.add("standalone");
      } else if (document.fullscreenElement) {
        document.documentElement.classList.add("fullscreen");
      } else {
        document.documentElement.classList.add("browser");
      }
    }

    detectDisplayMode();
  }, []);
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
