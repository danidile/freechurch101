"use client";
import { getSetList } from "@/hooks/GET/getSetList";
import { fullSetListT, setListT } from "@/utils/types/types";
import { useUserStore } from "@/store/useUserStore";
import { useState, useEffect } from "react";
import { Alert, Button } from "@heroui/react";
import ChurchLabLoader from "@/app/components/churchLabSpinner";
import LoginForm from "@/app/(auth-pages)/login/loginForm";
import { getSetlistSchedule } from "@/hooks/GET/getSetlistSchedule";
import { getSetListTeams } from "@/hooks/GET/getSetListTeams";
import { GroupedMembers } from "@/utils/types/types";
import SetlistSchedule from "./setlistScheduleC";
import SetlistTeams from "./setlistTeamsC";
import SetlistHeader from "./setlistHeaderC";
import Link from "next/link";
import { useSetlistsStore } from "@/store/useSetlistsStore";

export default function SetlistPage({ setListId }: { setListId: string }) {
  const { userData, loading } = useUserStore();
  const { setlists, fetchSetlists } = useSetlistsStore();

  useEffect(() => {
    if (setlists.some((s) => s.setlist.id === setListId)) {
      console.log("Setlist is in Store");
    } else {
      console.log("Setlist is NOT in Store");
      fetchSetlists(setListId);
    }
  }, [setlists, setListId]);

  // Refetch teams after email operations
  const refetchTeams = async () => {
    // try {
    //   const teams = await getSetListTeams(setListId);
    //   setSetlistData((prev) => ({ ...prev, teams }));
    // } catch (error) {
    //   console.error("Error refetching teams:", error);
    // }
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

  if (!setlists.find((s) => s.setlist.id === setListId)) {
    return <ChurchLabLoader />;
  }

  return (
    <div className="container-sub">
      <div className="w-full max-w-[600px]">
        <SetlistHeader
          setlist={setlists.find((s) => s.setlist.id === setListId).setlist}
          setListId={setListId}
          userData={userData}
        />

        {setlists.find((s) => s.setlist.id === setListId).schedule && (
          <>
            <SetlistSchedule
              schedule={
                setlists.find((s) => s.setlist.id === setListId).schedule
              }
            />
            <div className="center- gap-3 mt-5 mb-5">
              <Link href={`/setlist/${setListId}/view`}>
                <Button color="primary">Visualizza set completo</Button>
              </Link>
            </div>
          </>
        )}

        {setlists.find((s) => s.setlist.id === setListId).teams && (
          <SetlistTeams
            teams={setlists.find((s) => s.setlist.id === setListId).teams}
            setlist={setlists.find((s) => s.setlist.id === setListId).setlist}
            setListId={setListId}
            userData={userData}
            onTeamsUpdate={refetchTeams}
          />
        )}
      </div>
    </div>
  );
}
