"use client";
import { getSongsCompact } from "@/hooks/GET/getSongsCompact";
import UpdateSetlistForm from "../[setListId]/update/UpdateSetlistFormDragAndDrop";

import { isLeaderT, teamData, TsongNameAuthor } from "@/utils/types/types";
import { getChurchTeams } from "@/hooks/GET/getChurchTeams";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";
import { Spinner } from "@heroui/spinner";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import isTeamLeaderClient from "@/utils/supabase/isTeamLeaderClient";

export default function AddSetlistComponent() {
  const { userData, loading } = useUserStore();
  const [isLeader, setIsLeader] = useState<isLeaderT>();

  const [songs, setSongs] = useState<TsongNameAuthor[] | null>([]);
  const [teams, setTeams] = useState<teamData[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      if (!loading && userData && userData.church_id) {
        const fetchedTeams = await getChurchTeams(userData.church_id);
        setTeams(fetchedTeams);

        const fetchedSongs: TsongNameAuthor[] = await getSongsCompact(
          userData.church_id
        );
        setSongs(fetchedSongs);
        setIsLoading(false);
        const leaderStatus = await isTeamLeaderClient();
        setIsLeader(leaderStatus);
      }
    };
    fetchSongs();
  }, [loading, userData]);

  if (isLoading || !songs || !teams) {
    return (
      <div className="container-sub">
        <Spinner size="lg" />
      </div>
    );
  }
  const setlistData: null = null;
  if (
    isLeader.isLeader ||
    hasPermission(userData.role as Role, "create:setlists")
  ) {
    return (
      <div className="container-sub">
        <UpdateSetlistForm
          teams={teams}
          page="create"
          setlistData={setlistData}
          songsList={songs}
        />
      </div>
    );
  } else {
    return (
      <div className="container-sub ">
        <div className="max-w-[600px] h-[70vh] flex flex-col justify-center items-center text-center">
          <h3> Accesso negato.</h3>
          <p>
            Solo gli amministratori della chiesa e i responsabili dei team
            possono creare eventi e turnazioni.
          </p>
        </div>
      </div>
    );
  }
}
