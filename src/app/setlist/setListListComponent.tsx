"use client";
import { getSetListsByChurch } from "@/hooks/GET/getSetListsByChurch";
import { setListT } from "@/utils/types/types";
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
import CalendarComponent from "../calendar/calendarComponent";
import Link from "next/link";

export default function SetListListComponent() {
  const { userData, loading } = useUserStore();

  const [viewMode, setViewMode] = useState<string>("list");
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
      <div className="container-sub !max-w-96">
        <h5 className="text-center m-2">Prossimi eventi</h5>
        <div className="flex flex-row justify-center items-center gap-5">
          <p>Modalità visualizzazione:</p>
          <ButtonGroup>
            <Button
              isIconOnly
              color="primary"
              variant="flat"
              onPress={() => setViewMode("list")}
            >
              <FaList />
            </Button>
            <Button
              isIconOnly
              color="primary"
              variant="flat"
              onPress={() => setViewMode("calendar")}
            >
              <FaRegCalendarAlt />
            </Button>
            {(hasPermission(userData.role as Role, "create:setlists") ||
              TeamLeader) && (
              <Button
                isIconOnly
                color="primary"
                variant="solid"
                as={Link}
                href="/setlist/addSetlist"
              >
                <FaPlus />
              </Button>
            )}
          </ButtonGroup>
        </div>

        {viewMode === "list" && (
          <SetListTabs userData={userData} setlists={setlists} />
        )}
      </div>
      {viewMode === "calendar" && <CalendarComponent />}
    </>
  );
}
