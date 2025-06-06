"use client";
import { redirect } from "next/navigation";
import PWADashboard from "../PWADashboard";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { getPendingChurchMembershipRequests } from "@/hooks/GET/getPendingChurchMembershipRequests";

import { pendingRequestsT } from "@/utils/types/types";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";
import LoadingSongsPage from "@/app/songs/loading";
import { Spinner } from "@heroui/spinner";
import { useRouter } from "next/navigation";
export default function Dashboard() {
  const router = useRouter();
  const { userData, loading, fetchUser } = useUserStore();
  const [pendingRequests, setPendingRequests] = useState<
    pendingRequestsT[] | null
  >(null);
  const [loadingRequests, setLoadingRequests] = useState(true);

  // Step 1: Make sure user is fetched on first mount
  useEffect(() => {
    if (!userData.loggedIn) {
      fetchUser();
    }
  }, []);

  // Step 2: Once user is available, fetch songs
  useEffect(() => {
    if (!loading && userData.loggedIn) {
      if (hasPermission(userData.role as Role, "confirm:churchMembership")) {
        getPendingChurchMembershipRequests(userData.church_id).then(
          (fetchedRequests) => {
            setPendingRequests(fetchedRequests);
            setLoadingRequests(false);
          }
        );
      }
    }
  }, [loading, userData]);

  useEffect(() => {
    if (!loading && !userData.loggedIn) {
      router.push("/login");
    }
  }, [loading, userData.loggedIn, router]);
  if (loading || loadingRequests)
    return (
      <div className="container-sub">
        <Spinner size="lg" />
      </div>
    );

  if (userData) {
    return (
      <div className="flex flex-row w-full gap-12">
        {/* <Sidebar userData={userData} /> */}
        <div className="container-sub">
          <PWADashboard pendingRequests={pendingRequests} userData={userData} />
        </div>
      </div>
    );
  } else {
    redirect("/login");
  }
}
