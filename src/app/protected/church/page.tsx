"use client";
import { getSetListsByChurch } from "@/hooks/GET/getSetListsByChurch";
import { profileT, setListT } from "@/utils/types/types";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";

import { FiPlus } from "react-icons/fi";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";
import isTeamLeaderClient from "@/utils/supabase/isTeamLeaderClient";
import { TransitionLink } from "@/app/components/TransitionLink";
import SetListTabs from "@/app/components/SetListTabsComponent";
import { getProfilesByChurch } from "@/hooks/GET/getProfilesByChurch";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Button } from "@heroui/button";
import Link from "next/link";
import { FaRegEye } from "react-icons/fa";
import NextEventsComponent from "./nextEventsComponent";
import CalendarPage from "@/app/calendar/page";
import { Card } from "@heroui/card";
export default function Page() {
  const { userData, loading } = useUserStore();
  const [setlists, setSetlists] = useState<any[] | null>([]);
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
  const [profiles, setProfiles] = useState<any[] | null>([]);

  // Step 2: Once user is available, fetch songs
  useEffect(() => {
    if (
      !loading &&
      userData.loggedIn &&
      hasPermission(userData.role as Role, "read:churchmembers")
    ) {
      getProfilesByChurch(userData.church_id).then(
        (fetchedPeople: profileT[]) => {
          setProfiles(fetchedPeople);
        }
      );
    }
  }, [loading, userData]);
  return (
    <div className="p-0 sm:p-5">
      <div className="w-full">
        <h5 className="font-bold ml-3 my-5">{userData.church_name}</h5>
      </div>
      <div className="max-w-full mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            <Table
              isHeaderSticky
              classNames={{
                base: "max-h-[820px] overflow-scroll",
                table: "min-h-[400px]",
              }}
              topContent={<h6 className="font-bold">Membri di chiesa</h6>}
            >
              <TableHeader>
                <TableColumn>Nome</TableColumn>
                <TableColumn className="hidden sm:table-cell">
                  Email
                </TableColumn>
                <TableColumn>Azioni</TableColumn>
              </TableHeader>
              <TableBody items={profiles}>
                {(item) => (
                  <TableRow key={item.profile}>
                    <TableCell className="py-[2px]">
                      {" "}
                      {item.name} {item.lastname}
                    </TableCell>
                    <TableCell className="py-[2px] hidden sm:table-cell">
                      {item.email}{" "}
                    </TableCell>
                    <TableCell className="max-w-[50px] py-[2px]">
                      {hasPermission(userData.role as Role, "update:teams") && (
                        <div className="relative flex flex-row justify-center items-center gap-1 mx-auto">
                          <Dropdown>
                            <DropdownTrigger>
                              <Button
                                className="mx-auto"
                                isIconOnly
                                variant="light"
                                size="sm"
                              >
                                <BsThreeDotsVertical />
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Static Actions">
                              <DropdownItem
                                key="update"
                                as={Link}
                                startContent={<FaRegEye />}
                                href={`/people/${item.id}`}
                              >
                                Visualizza dettagli utente
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>

          <Card className="p-3">
            <h6 className="font-bold pt-3 pb-2">Calendario di Chiesa</h6>
            <CalendarPage />
          </Card>
        </div>
      </div>
    </div>
  );
}
