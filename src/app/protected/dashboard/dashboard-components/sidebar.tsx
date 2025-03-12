"use client";
import { basicUserData } from "@/utils/types/userData";
import PWADashboard from "../PWADashboard";
import { useUserStore } from "@/store/user";
import { useEffect, useState } from "react";
import { fetchUserFromServer } from "@/hooks/GET/userZustand";

export default function Sidebar({ userData }: { userData: basicUserData }) {
  return (
    <div className="dashboard-sidebar-container">
      <PWADashboard pendingRequests={null} userData={userData} />
    </div>
  );
}
