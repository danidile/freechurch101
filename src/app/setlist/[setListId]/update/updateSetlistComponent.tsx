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
import { getChurchTeams } from "@/hooks/GET/getChurchTeams";
import { useSetlistsStore } from "@/store/useSetlistsStore";
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
  const [churchTeams, setChurchTeams] = useState<teamData[] | null>(null); // Start with null
  const oldData = useRef<setListT | null>(null);
  const { setlists, fetchSetlists } = useSetlistsStore();

  const fetchChurchTeams = async () => {
    const fetchedChurchTeams: teamData[] = await getChurchTeams(
      userData.church_id
    );
    setChurchTeams(fetchedChurchTeams);
  };
  useEffect(() => {
    if (setlists.some((s) => s.setlist.id === setListId)) {
      if (
        setlists.find((s) => s.setlist.id === setListId)?.setlist &&
        !setlistData
      ) {
        setSetlistData(
          setlists.find((s) => s.setlist.id === setListId)?.setlist
        );
        oldData.current = {
          ...setlists.find((s) => s.setlist.id === setListId)?.setlist,
        };
      }
      if (
        setlists.find((s) => s.setlist.id === setListId)?.schedule &&
        !schedule
      ) {
        setSchedule(setlists.find((s) => s.setlist.id === setListId)?.schedule);
        oldData.current = {
          ...oldData.current,
          schedule: setlists.find((s) => s.setlist.id === setListId)?.schedule,
        };
      }
      if (setlists.find((s) => s.setlist.id === setListId).teams && !teams) {
        setTeams(setlists.find((s) => s.setlist.id === setListId).teams);
        oldData.current = {
          ...oldData.current,
          teams: setlists.find((s) => s.setlist.id === setListId)?.teams,
        };
      }
      fetchChurchTeams();
    } else {
      fetchSetlists(setListId);
    }
  }, [setlists]);
  useEffect(() => {
    // Only run the effect if not already loading and we have a valid church_id
    if (!loading && userData && userData.church_id && !setlistData) {
      const fetchSongs = async () => {
        if (!loading && userData && userData.church_id) {
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
        churchTeams={churchTeams}
      />
    </div>
  );
}
