"use client";
import { getSetList } from "@/hooks/GET/getSetList";
import { setListT } from "@/utils/types/types";
import { useUserStore } from "@/store/useUserStore";
import { useState, useEffect } from "react";
import { Alert } from "@heroui/react";
import ChurchLabLoader from "@/app/components/churchLabSpinner";
import LoginForm from "@/app/(auth-pages)/login/loginForm";
import { getSetlistSchedule } from "@/hooks/GET/getSetlistSchedule";
import { getSetListTeams } from "@/hooks/GET/getSetListTeams";
import { GroupedMembers } from "@/utils/types/types";
import SetlistHeader from "./setlistHeader";
import SetlistSchedule from "./setlistSchedule";
import SetlistTeams from "./setlistTeams";

export default function SetlistPage({ setListId }: { setListId: string }) {
  const { userData, loading } = useUserStore();
  const [setlistData, setSetlistData] = useState<{
    setlist: setListT | null;
    schedule: any[] | null;
    teams: GroupedMembers | null;
    loading: boolean;
  }>({
    setlist: null,
    schedule: null,
    teams: null,
    loading: true,
  });

  // Fetch all setlist data
  useEffect(() => {
    if (!loading && userData.loggedIn) {
      console.time("fetchSetlistData");
      const fetchSetlistData = async () => {
        try {
          const [setlist, schedule, teams] = await Promise.all([
            getSetList(setListId),
            getSetlistSchedule(setListId),
            getSetListTeams(setListId),
          ]);

          setSetlistData({
            setlist,
            schedule,
            teams,
            loading: false,
          });
        } catch (error) {
          console.error("Error fetching setlist data:", error);
          setSetlistData((prev) => ({ ...prev, loading: false }));
        }
        console.timeEnd("fetchSetlistData");
      };

      fetchSetlistData();
    }
  }, [loading, userData, setListId]);

  // Refetch teams after email operations
  const refetchTeams = async () => {
    try {
      const teams = await getSetListTeams(setListId);
      setSetlistData((prev) => ({ ...prev, teams }));
    } catch (error) {
      console.error("Error refetching teams:", error);
    }
  };

  if (!userData.loggedIn && !loading) {
    return (
      <div className="container-sub">
        <Alert
          color="danger"
          className="max-w-[340px] mx-auto"
          description="Questa pagina è riservata ai membri della chiesa."
          title="Accesso bloccato"
        />
        <LoginForm />
      </div>
    );
  }

  if (setlistData.loading || !setlistData.setlist) {
    return <ChurchLabLoader />;
  }

  return (
    <div className="container-sub">
      <div className="song-presentation-container">
        <SetlistHeader
          setlist={setlistData.setlist}
          setListId={setListId}
          userData={userData}
        />

        {setlistData.schedule && (
          <SetlistSchedule
            schedule={setlistData.schedule}
            setListId={setListId}
          />
        )}

        {setlistData.teams && (
          <SetlistTeams
            teams={setlistData.teams}
            setlist={setlistData.setlist}
            setListId={setListId}
            userData={userData}
            onTeamsUpdate={refetchTeams}
          />
        )}
      </div>
    </div>
  );
}
