"use client";
import { useUserStore } from "@/store/useUserStore";
import TeamsForm from "../teamsForm";

import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { getChurchMembersCompact } from "@/hooks/GET/getChurchMembersCompact";
import { churchMembersT } from "@/utils/types/types";
import { Spinner } from "@heroui/spinner";

export default function CreateTeamComponent() {
  const { userData, loading } = useUserStore();
  const [churchMembers, setChurchMembers] = useState<churchMembersT[] | null>(
    []
  );
  const [loadingSongs, setLoadingSongs] = useState(true);

  useEffect(() => {
    const fetchChurchMembers = async () => {
      if (!loading && userData.loggedIn) {
        const fetchedSongs = await getChurchMembersCompact(userData.church_id);
        setChurchMembers(fetchedSongs);
        setLoadingSongs(false);
      }
    };

    fetchChurchMembers();
  }, [loading, userData.loggedIn]);
  if (loadingSongs || !churchMembers) {
    return (
      <div className="container-sub">
        <Spinner size="lg" />
      </div>
    );
  }
  return (
    <div className="container-sub">
      <TeamsForm
        page="create"
        churchTeam={null}
        churchMembers={churchMembers}
      />
    </div>
  );
}
