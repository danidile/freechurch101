import logoutTest from "@/app/components/logOutAction";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { basicUserData } from "@/utils/types/userData";
import { Image, Link } from "@heroui/react";
import PWADashboard from "../PWADashboard";

export default function Sidebar({ userData }: { userData: basicUserData }) {
  return (
    <div className="dashboard-sidebar-container">
      <PWADashboard userData={userData} />
    </div>
  );
}
