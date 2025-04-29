// dashboard-wrapper.tsx
"use client";

import Dashboard from "./dashboard-components/dashboard";
import { basicUserData } from "@/utils/types/userData";

export default function DashboardWrapper({ userData }: { userData: basicUserData}) {
  return <Dashboard userData={userData} />;
}
