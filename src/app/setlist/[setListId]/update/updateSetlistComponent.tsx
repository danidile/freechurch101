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
  const [canEditEventData, setCanEditEventData] = useState<boolean>(true);
  useEffect(() => {
    const fetchSongs = async () => {
      if (!loading && userData && userData.church_id) {
        const fetchedSetlist: setListT = await getSetList(setListId);
        setSetlistData(fetchedSetlist);

        const fetchedSchedule = await getSetlistSchedule(setListId);
        fetchedSetlist.schedule = fetchedSchedule;
        setSetlistData(fetchedSetlist);

        const fetchedSetlistTeams = await getSelectedChurchTeams(
          userData.church_id,
          setListId
        );
        fetchedSetlist.teams = fetchedSetlistTeams;
        setSetlistData(fetchedSetlist);

        const fetchedSongs: TsongNameAuthor[] = await getSongsCompact(
          userData.church_id
        );
        setSongs(fetchedSongs);
        setSetlistData(fetchedSetlist);
      }
      checkPermissionClient(
        userData.teams,
        "setlists",
        "edit",
        userData.id,
        userData.role
      ).then((result: boolean) => {
        setCanEditEventData(result);
        console.log("canEditEventData", canEditEventData);
      });
    };
    fetchSongs();
  }, [loading, userData, setListId]);

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
