"use client";
import { useUserStore } from "@/store/useUserStore";
import TeamsForm from "../teamsForm";
import { useState, useEffect } from "react";
import { getChurchMembersCompact } from "@/hooks/GET/getChurchMembersCompact";
import { churchMembersT } from "@/utils/types/types";
import { Spinner } from "@heroui/spinner";
import { HeaderCL } from "@/app/components/header-comp";
import { FaAsterisk } from "react-icons/fa";

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
      <HeaderCL icon={FaAsterisk} title="Crea Team" />
      <TeamsForm
        page="create"
        churchTeam={null}
        churchMembers={churchMembers}
      />
    </div>
  );
}
