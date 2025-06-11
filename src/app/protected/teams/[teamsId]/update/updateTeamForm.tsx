"use client";

import { churchMembersT, teamData } from "@/utils/types/types";
import { getChurchTeam } from "@/hooks/GET/getChurchTeam";
import { getChurchMembersCompact } from "@/hooks/GET/getChurchMembersCompact";
import TeamsForm from "../../teamsForm";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";
import { Spinner } from "@heroui/spinner";

export default function UpdateTeamForm({
  params,
}: {
  params: { teamsId: string };
}) {
  const { userData, loading } = useUserStore();
  const [churchMembers, setChurchMembers] = useState<churchMembersT[] | null>(
    []
  );
  const [churchTeam, setChurchTeam] = useState<teamData | null>();
  const [loadingSongs, setLoadingSongs] = useState(true);

  useEffect(() => {
    const fetchChurchMembers = async () => {
      if (!loading && userData.loggedIn) {
        const fetchedMembers = await getChurchMembersCompact(userData.church_id);
        setChurchMembers(fetchedMembers);
        const fetchedTeam = await getChurchTeam(params.teamsId);
        setChurchTeam(fetchedTeam);
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
        page="update"
        churchTeam={churchTeam}
        churchMembers={churchMembers}
      />
    </div>
  );
}
