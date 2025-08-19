"use client";
import CopyLinkButton from "@/app/components/CopyLinkButton";
import MoreDropdownSetlist from "./MoreDropdownSetlist";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { useChurchStore } from "@/store/useChurchStore";
import { useState, useEffect } from "react";
import isTeamLeaderClient from "@/utils/supabase/isTeamLeaderClient";
import { setListT } from "@/utils/types/types";
import { LuCalendarRange } from "react-icons/lu";
import { HeaderCL } from "@/app/components/header-comp";

interface SetlistHeaderProps {
  setlist: setListT;
  setListId: string;
  userData: any;
}

export default function SetlistHeader({
  setlist,
  setListId,
  userData,
}: SetlistHeaderProps) {
  const { eventTypes, rooms } = useChurchStore();
  const [isTeamLeader, setIsTeamLeader] = useState(false);

  useEffect(() => {
    const fetchLeaderStatus = async () => {
      if (userData.loggedIn) {
        const leaderStatus = await isTeamLeaderClient();
        setIsTeamLeader(leaderStatus.isLeader);
      }
    };
    fetchLeaderStatus();
  }, [userData]);

  const date = new Date(setlist.date);
  const readableDate = date.toLocaleString("it-IT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const matched = eventTypes?.find((event) => event.key === setlist.event_type);
  const setlistRoom = rooms?.find((room) => room.id === setlist.room);

  return (
    <>
      <HeaderCL
        icon={LuCalendarRange}
        title={matched?.alt || matched?.label || "Evento sconosciuto"}
        content={
          <div className="flex flex-wrap justify-between">
            <div className="top-settings-bar">
              <CopyLinkButton />
              {userData &&
                (hasPermission(userData.role as Role, "create:setlists") ||
                  isTeamLeader) && (
                  <MoreDropdownSetlist
                    userData={userData}
                    setlistId={setListId}
                  />
                )}
            </div>
          </div>
        }
      />

      <p className="capitalize my-2">
        <b>ora: </b>
        {readableDate}
      </p>
      <p className="my-2">
        <b>Location: </b>
        {setlistRoom?.name}
        {" - "} {setlistRoom?.address}
      </p>
    </>
  );
}
