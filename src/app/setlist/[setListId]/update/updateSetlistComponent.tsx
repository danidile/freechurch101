"use client";
import { getSetList } from "@/hooks/GET/getSetList";
import UpdateSetlistForm from "./UpdateSetlistFormDragAndDrop";
import { setListT, TsongNameAuthor } from "@/utils/types/types";
import { getSongsCompact } from "@/hooks/GET/getSongsCompact";
import { getSetListSongsCompact } from "@/hooks/GET/getSetListSongsCompact";

import { getSelectedChurchTeams } from "@/hooks/GET/getSelectedChurchTeams";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { Spinner } from "@heroui/spinner";
import { getSetlistSchedule } from "@/hooks/GET/getSetlistSchedule";
import ChurchLabLoader from "@/app/components/churchLabSpinner";
export default function UpdateSetlistComponent({
  setListId,
}: {
  setListId: string;
}) {
  const { userData, loading } = useUserStore();
  const [setlistData, setSetlistData] = useState<setListT | null>({});
  const [songs, setSongs] = useState<TsongNameAuthor[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchSongs = async () => {
      if (!loading && userData && userData.church_id) {
        const fetchedSetlist: setListT = await getSetList(setListId);
        const fetchedSetlistsongs = await getSetListSongsCompact(setListId);
        const fetchedSchedule = await getSetlistSchedule(setListId);

        const fetchedSetlistTeams = await getSelectedChurchTeams(
          userData.church_id,
          setListId
        );
        fetchedSetlist.teams = fetchedSetlistTeams;
        fetchedSetlist.schedule = fetchedSchedule;
        fetchedSetlist.setListSongs = fetchedSetlistsongs;

        setSetlistData(fetchedSetlist);
        const fetchedSongs: TsongNameAuthor[] = await getSongsCompact(
          userData.church_id
        );
        setSongs(fetchedSongs);
        setIsLoading(false);
      }
    };
    fetchSongs();
  }, [loading, userData, setListId]);

  if (isLoading || !setlistData || !songs) {
    return (
      <div className="container-sub min-h-[80vh] flex ">
        <ChurchLabLoader />
      </div>
    );
  }
  return (
    <div className="container-sub">
      <UpdateSetlistForm
        teams={setlistData.teams}
        page="update"
        setlistData={setlistData}
        songsList={songs}
      />
    </div>
  );
}
