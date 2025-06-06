
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./sidebar";
import { useUserStore } from "@/store/useUserStore";
import LoadingSidebar from "./loading";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="dashboard-container">{children}</div>
    </div>
  );
}
