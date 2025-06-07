"use client";
import { redirect } from "next/navigation";
import PWADashboard from "../PWADashboard";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { getPendingChurchMembershipRequests } from "@/hooks/GET/getPendingChurchMembershipRequests";
import { pendingRequestsT } from "@/utils/types/types";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";
export default function Dashboard() {
  const { userData, loading } = useUserStore();
  const [pendingRequests, setPendingRequests] = useState<
    pendingRequestsT[] | null
  >(null);

  useEffect(() => {
    if (!loading && userData.loggedIn) {
      if (hasPermission(userData.role as Role, "confirm:churchMembership")) {
        getPendingChurchMembershipRequests(userData.church_id).then(
          (fetchedRequests) => {
            setPendingRequests(fetchedRequests);
          }
        );
      }
    }
  }, [loading, userData]);

  if (userData) {
    return (
      <div className="flex flex-row w-full gap-12">
        <div className="container-sub">
          <PWADashboard pendingRequests={pendingRequests} userData={userData} />
        </div>
      </div>
    );
  } else {
    redirect("/login");
  }
}
