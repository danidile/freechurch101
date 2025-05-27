"use client";
import { basicUserData } from "@/utils/types/userData";
import PWADashboard from "../PWADashboard";

export default function Sidebar({ userData }: { userData: basicUserData }) {
  return (
    <div className="dashboard-sidebar-container">
      <PWADashboard pendingRequests={null} userData={userData} />
    </div>
  );
}
