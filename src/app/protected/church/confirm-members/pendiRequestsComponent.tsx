"use client";
import { redirect } from "next/navigation";

import { pendingRequestsT, profileT } from "@/utils/types/types";
import PeopleToConfirm from "./peopleDrawerList";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { getPendingChurchMembershipRequests } from "@/hooks/GET/getPendingChurchMembershipRequests";
import LoadingSongsPage from "@/app/songs/loading";
import { useUserStore } from "@/store/useUserStore";
import { useState, useEffect } from "react";

export default function PendiRequestsComponent() {
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

  if (loading || loadingRequests || !userData.loggedIn)
    return <LoadingSongsPage />;

  if (userData) {
    return (
      <div className="container-sub ">
        <h3>Conferma </h3>
        <small className="max-w-96 mb-10 text-slate-400">
          Le persone elencate in questa lista vogliono diventare parte della tua
          chiesa. Confermi che ne fanno parte?
        </small>
        <div className="flex-col gap-3">
          {pendingRequests &&
            pendingRequests.map((profile: profileT) => {
              return (
                <PeopleToConfirm
                  userData={userData}
                  profile={profile}
                  key={profile.id}
                />
              );
            })}
        </div>
      </div>
    );
  } else {
    redirect("/login");
  }
}
