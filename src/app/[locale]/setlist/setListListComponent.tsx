"use client";
import { getSetListsByChurch } from "@/hooks/GET/getSetListsByChurch";
import { setListT } from "@/utils/types/types";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";
import isTeamLeaderClient from "@/utils/supabase/isTeamLeaderClient";
import { Button } from "@heroui/react";
import CalendarComponent from "../components/calendarComponent";
import { Link } from "@/i18n/navigation";
import { HeaderCL } from "../components/header-comp";
import { LuCalendarPlus, LuCalendarRange } from "react-icons/lu";

export default function SetListListComponent() {
  const { userData, loading } = useUserStore();
  const [setlists, setSetlists] = useState<setListT[] | null>(null);
  const [TeamLeader, setTeamLeader] = useState<boolean>(false);

  useEffect(() => {
    if (!loading && userData?.loggedIn) {
      getSetListsByChurch(userData.church_id).then(
        (fetchedSetLists: setListT[]) => {
          setSetlists(fetchedSetLists);
        },
      );
    }
  }, [loading, userData]);

  useEffect(() => {
    const fetchLeaderStatus = async () => {
      if (!loading && userData?.loggedIn) {
        const leaderStatus = await isTeamLeaderClient();
        setTeamLeader(leaderStatus.isLeader);
      }
    };
    fetchLeaderStatus();
  }, [loading, userData]);

  return (
    <div className="container-sub">
      <HeaderCL
        icon={LuCalendarRange}
        title="Prossimi eventi"
        content={
          <div className="flex flex-row justify-start items-center gap-2">
            <p>Crea nuovo evento:</p>
            {(hasPermission(userData?.role as Role, "create:setlists") ||
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
      />
      <CalendarComponent userData={userData} setlists={setlists || []} />
    </div>
  );
}
