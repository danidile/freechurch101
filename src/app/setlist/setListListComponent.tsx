"use client";
import { getSetListsByChurch } from "@/hooks/GET/getSetListsByChurch";
import { GroupedMembers, setListT } from "@/utils/types/types";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { TransitionLink } from "../components/TransitionLink";
import SetListTabs from "../components/SetListTabsComponent";
import { FiPlus } from "react-icons/fi";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";
import isTeamLeaderClient from "@/utils/supabase/isTeamLeaderClient";
import { Button, ButtonGroup } from "@heroui/react";
import { FaList, FaPlus } from "react-icons/fa6";
import { FaRegCalendarAlt } from "react-icons/fa";
import CalendarComponent from "../components/calendarComponent";
import Link from "next/link";
import { HeaderCL } from "../components/header-comp";
import {
  LuCalendarDays,
  LuCalendarPlus,
  LuCalendarRange,
  LuList,
} from "react-icons/lu";
import { getSetListTeams } from "@/hooks/GET/getSetListTeams";

export default function SetListListComponent() {
  const { userData, loading } = useUserStore();

  const [viewMode, setViewMode] = useState<string>("calendar");
  const [setlists, setSetlists] = useState<any[] | null>(null);
  useEffect(() => {
    if (!loading && userData.loggedIn) {
      getSetListsByChurch(userData.church_id).then(
        (fetchedSetLists: setListT[]) => {
          setSetlists(fetchedSetLists);
        }
      );
    }
  }, [loading, userData]);
  useEffect(() => {
    if (viewMode === "list" && setlists) {
      const today = new Date();

      const fetchSetlistsFull = async () => {
        const detailedSetlists = await Promise.all(
          setlists.map(async (singleSetlist) => {
            if (today > new Date(singleSetlist.date)) {
              return singleSetlist; // Skip past events
            }
            const setlistTeams: GroupedMembers = await getSetListTeams(
              singleSetlist.id
            );
            return {
              ...singleSetlist,
              setlistTeams: setlistTeams, // Add the fetched teams to the setlist object
            };
          })
        );
        setSetlists(detailedSetlists);
        console.log(detailedSetlists);
      };
      fetchSetlistsFull();
    }
  }, [viewMode]);

  const [TeamLeader, setTeamLeader] = useState<boolean>(false);
  useEffect(() => {
    const fetchLeaderStatus = async () => {
      if (!loading && userData.loggedIn) {
        const leaderStatus = await isTeamLeaderClient();
        setTeamLeader(leaderStatus.isLeader);
      }
    };
    fetchLeaderStatus();
  }, [loading, userData]);

  return (
    <>
      <div className="container-sub">
        <HeaderCL
          icon={LuCalendarRange}
          content={
            <div className="flex flex-row justify-start items-center gap-2">
              <p>Modalità visualizzazione:</p>
              <Button
                isIconOnly
                color="default"
                variant="flat"
                onPress={() => setViewMode("list")}
              >
                <LuList size={18} />
              </Button>
              <Button
                isIconOnly
                color="default"
                variant="flat"
                onPress={() => setViewMode("calendar")}
              >
                <LuCalendarDays size={18} />
              </Button>
              {(hasPermission(userData.role as Role, "create:setlists") ||
                TeamLeader) && (
                <Button
                  isIconOnly
                  color="primary"
                  variant="flat"
                  as={Link}
                  href="/setlist/addSetlist"
                >
                  <LuCalendarPlus size={18} />
                </Button>
              )}
            </div>
          }
          title="Prossimi eventi"
        />{" "}
        <h5 className="text-center m-2"></h5>
        {viewMode === "list" && (
          <SetListTabs userData={userData} setlists={setlists} />
        )}
      </div>
      {viewMode === "calendar" && (
        <CalendarComponent userData={userData} setlists={setlists} />
      )}
    </>
  );
}
