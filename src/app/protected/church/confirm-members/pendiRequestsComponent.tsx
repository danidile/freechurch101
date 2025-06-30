"use client";
import { redirect } from "next/navigation";

import { pendingRequestsT, profileT } from "@/utils/types/types";
import PeopleToConfirm from "./peopleDrawerList";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { getPendingChurchMembershipRequests } from "@/hooks/GET/getPendingChurchMembershipRequests";
import { useUserStore } from "@/store/useUserStore";
import { useState, useEffect } from "react";

export default function PendiRequestsComponent() {
  const { userData, loading, fetchUser } = useUserStore();
  const [pendingRequests, setPendingRequests] = useState<
    pendingRequestsT[] | []
  >([]);

  // Step 1: Make sure user is fetched on first mount
  useEffect(() => {
    if (!userData.loggedIn) {
      fetchUser();
    }
  }, []);

  // Step 2: Once user is available, fetch songs
  useEffect(() => {
    if (!loading && userData) {
      if (hasPermission(userData.role as Role, "confirm:churchMembership")) {
        getPendingChurchMembershipRequests(userData.church_id).then(
          (fetchedRequests) => {
            console.log("fetchedRequests", fetchedRequests);
            setPendingRequests(fetchedRequests);
          }
        );
      }
      console.log(pendingRequests);
    }
  }, [loading, userData]);

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
