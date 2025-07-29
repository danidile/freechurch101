"use client";
import { getSetList } from "@/hooks/GET/getSetList";
import UpdateSetlistForm from "./UpdateSetlistFormDragAndDrop";
import { setListT, TsongNameAuthor } from "@/utils/types/types";
import { getSongsCompact } from "@/hooks/GET/getSongsCompact";
import { getSetListSongsCompact } from "@/hooks/GET/getSetListSongsCompact";

import { getSelectedChurchTeams } from "@/hooks/GET/getSelectedChurchTeams";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { getSetlistSchedule } from "@/hooks/GET/getSetlistSchedule";
import ChurchLabLoader from "@/app/components/churchLabSpinner";
import { checkPermissionClient } from "@/utils/supabase/permissions/checkPermissionClient";
export default function UpdateSetlistComponent({
  setListId,
}: {
  setListId: string;
}) {
  const { userData, loading } = useUserStore();
  const [setlistData, setSetlistData] = useState<setListT | null>({});
  const [songs, setSongs] = useState<TsongNameAuthor[] | null>([]);
  const [canEditEventData, setCanEditEventData] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchSongs = async () => {
      if (!loading && userData && userData.church_id) {
        console.time("fetchedSetlist");

        const fetchedSetlist: setListT = await getSetList(setListId);
        console.timeEnd("fetchedSetlist");

        console.time("fetchedSchedule");

        const fetchedSchedule = await getSetlistSchedule(setListId);
        console.timeEnd("fetchedSchedule");
        console.time("fetchedSetlistTeams");

        const fetchedSetlistTeams = await getSelectedChurchTeams(
          userData.church_id,
          setListId
        );
        console.timeEnd("fetchedSetlistTeams");

        fetchedSetlist.teams = fetchedSetlistTeams;
        fetchedSetlist.schedule = fetchedSchedule;

        setSetlistData(fetchedSetlist);
        const fetchedSongs: TsongNameAuthor[] = await getSongsCompact(
          userData.church_id
        );
        setSongs(fetchedSongs);
        setIsLoading(false);
      }
      checkPermissionClient(
        userData.teams,
        "setlists",
        "edit",
        userData.id,
        userData.role
      ).then((result: boolean) => setCanEditEventData(result));
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
        canEditEventData={canEditEventData}
      />
    </div>
  );
}
