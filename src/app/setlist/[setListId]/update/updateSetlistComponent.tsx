"use client";
import { getSetList } from "@/hooks/GET/getSetList";
import UpdateSetlistForm from "./UpdateSetlistFormDragAndDrop";
import {
  GroupedMembers,
  setListSongT,
  setListT,
  teamData,
  TsongNameAuthor,
} from "@/utils/types/types";
import { getSongsCompact } from "@/hooks/GET/getSongsCompact";
import { getSelectedChurchTeams } from "@/hooks/GET/getSelectedChurchTeams";
import { useEffect, useRef, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { getSetlistSchedule } from "@/hooks/GET/getSetlistSchedule";
import { checkPermissionClient } from "@/utils/supabase/permissions/checkPermissionClient";
import ChurchLabLoader from "@/app/components/churchLabSpinner";
export default function UpdateSetlistComponent({
  setListId,
}: {
  setListId: string;
}) {
  const { userData, loading } = useUserStore();
  const [setlistData, setSetlistData] = useState<setListT | null>(null); // Start with null
  const [songs, setSongs] = useState<TsongNameAuthor[] | null>([]);
  const [canEditEventData, setCanEditEventData] = useState<boolean>(true);
  const [schedule, setSchedule] = useState<setListSongT[] | null>(null); // Start with null
  const [teams, setTeams] = useState<teamData[] | null>(null); // Start with null
  const oldData = useRef<setListT | null>(null);
  useEffect(() => {
    // Only run the effect if not already loading and we have a valid church_id
    if (!loading && userData && userData.church_id && !setlistData) {
      const fetchSongs = async () => {
        if (!loading && userData && userData.church_id) {
          const fetchedSetlist: setListT = await getSetList(setListId);
          setSetlistData(fetchedSetlist);
          oldData.current = {
            ...fetchedSetlist,
          };
          if (!schedule) {
            const fetchedSchedule = await getSetlistSchedule(setListId);
            setSchedule(fetchedSchedule);
            console.log("Schedule fetched:", fetchedSchedule);
            oldData.current = { ...oldData.current, schedule: fetchedSchedule };
          }

          const fetchedSetlistTeams = await getSelectedChurchTeams(
            userData.church_id,
            setListId
          );
          setTeams(fetchedSetlistTeams);
          oldData.current = {
            ...oldData.current,
            teams: fetchedSetlistTeams,
          };
          console.log("teams fetched:", fetchedSetlistTeams);
          const fetchedSongs: TsongNameAuthor[] = await getSongsCompact(
            userData.church_id
          );
          setSongs(fetchedSongs);
        }

        checkPermissionClient(
          userData.teams,
          "setlists",
          "edit",
          userData.id,
          userData.role
        ).then((result: boolean) => {
          setCanEditEventData(result);
        });
      };
      fetchSongs();
    }
  }, [loading, userData]); // Add setlistData to dependency array to prevent re-fetch

  if (!setlistData) {
    return <ChurchLabLoader />;
  }

  return (
    <div className="container-sub">
      <UpdateSetlistForm
        teams={teams}
        schedule={schedule}
        page="update"
        setlistData={setlistData}
        songsList={songs}
        canEditEventData={canEditEventData}
        setSetlistData={setSetlistData}
        setTeams={setTeams}
        setSchedule={setSchedule}
        oldData={oldData.current}
      />
    </div>
  );
}
