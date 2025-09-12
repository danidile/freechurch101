"use client";
import { getSongsCompact } from "@/hooks/GET/getSongsCompact";
import UpdateSetlistForm from "../[setListId]/update/UpdateSetlistFormDragAndDrop";
import {
  setListSongT,
  setListT,
  teamData,
  TsongNameAuthor,
} from "@/utils/types/types";
import { getChurchTeams } from "@/hooks/GET/getChurchTeams";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";

export default function AddSetlistComponent() {
  const { userData, loading } = useUserStore();
  const [setlistData, setSetlistData] = useState<setListT | null>(null); // Start with null
  const [churchTeams, setChurchTeams] = useState<teamData[] | null>(null); // Start with null

  const [songs, setSongs] = useState<TsongNameAuthor[]>([]);
  const [teams, setTeams] = useState<teamData[]>([]);
  const [schedule, setSchedule] = useState<setListSongT[] | null>([]); // Start with null
  useEffect(() => {
    const fetchAllData = async () => {
      if (!loading && userData?.church_id) {
        try {
          const [fetchedTeams, fetchedSongs] = await Promise.all([
            getChurchTeams(userData.church_id),
            getSongsCompact(userData.church_id),
          ]);
          setChurchTeams(fetchedTeams);
          setSongs(fetchedSongs);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        }
      }
    };

    fetchAllData();
  }, [loading, userData]);

  return (
    <div className="container-sub">
      <UpdateSetlistForm
        teams={teams}
        page="create"
        schedule={schedule}
        setlistData={setlistData}
        songsList={songs}
        canEditEventData={true}
        setSetlistData={setSetlistData}
        setTeams={setTeams}
        setSchedule={setSchedule}
        churchTeams={churchTeams}
      />
    </div>
  );
}
