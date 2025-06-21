"use client";
import { getSongsCompact } from "@/hooks/GET/getSongsCompact";
import UpdateSetlistForm from "../[setListId]/update/UpdateSetlistFormDragAndDrop";

import { teamData, TsongNameAuthor } from "@/utils/types/types";
import { getChurchTeams } from "@/hooks/GET/getChurchTeams";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";
import { Spinner } from "@heroui/spinner";

export default function AddSetlistComponent() {
  const { userData, loading } = useUserStore();

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
}
