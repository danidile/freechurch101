"use client";
import { getSongsCompact } from "@/hooks/GET/getSongsCompact";
import UpdateSetlistForm from "../[setListId]/update/UpdateSetlistFormDragAndDrop";
import { teamData, TsongNameAuthor } from "@/utils/types/types";
import { getChurchTeams } from "@/hooks/GET/getChurchTeams";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";

export default function AddSetlistComponent() {
  const { userData, loading } = useUserStore();

  const [songs, setSongs] = useState<TsongNameAuthor[]>([]);
  const [teams, setTeams] = useState<teamData[]>([]);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!loading && userData?.church_id) {
        try {
          const [fetchedTeams, fetchedSongs] = await Promise.all([
            getChurchTeams(userData.church_id),
            getSongsCompact(userData.church_id),
          ]);
          setTeams(fetchedTeams);
          setSongs(fetchedSongs);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        }
      }
    };

    fetchAllData();
  }, [loading, userData]);

  const setlistData: null = null;

  return (
    <div className="container-sub">
      <UpdateSetlistForm
        teams={teams}
        page="create"
        setlistData={setlistData}
        songsList={songs}
        canEditEventData={true}
      />
    </div>
  );
}
