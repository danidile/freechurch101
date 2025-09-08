"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { scheduleTemplate } from "@/utils/types/types";
import { Button } from "@heroui/button";
import Link from "next/link";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { FaPlus } from "react-icons/fa";
import { getChurchScheduleTemplates } from "@/hooks/GET/getChurchScheduleTemplates";
import ScheduleListComponent from "./ChurchSongTableComponent";
import { LuLayoutTemplate } from "react-icons/lu";
import { HeaderCL } from "@/app/components/header-comp";

export default function SongsPageClient() {
  const { userData } = useUserStore();
  const [schedules, setSchedules] = useState<scheduleTemplate[] | null>([]);

  useEffect(() => {
    const fetchSongs = async () => {
      const fetchedTemplates = await getChurchScheduleTemplates(
        userData.church_id
      );
      setSchedules(fetchedTemplates);
    };
    fetchSongs();
  }, [userData?.loggedIn]);

  if (schedules && schedules.length > 0) {
    return (
      <div className="container-sub">
        <div className="flex flex-row gap-5 items-center justify-center">
          <HeaderCL
            icon={LuLayoutTemplate}
            titleDropDown={
              hasPermission(userData.role as Role, "create:songs") && (
                <Dropdown>
                  <DropdownTrigger>
                    <Button color="primary" isIconOnly variant="flat">
                      <FaPlus />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Static Actions">
                    <DropdownItem
                      as={Link}
                      href="/protected/church/personalize/schedule-template/add"
                      key="add"
                      color="primary"
                      variant="flat"
                    >
                      Aggiungi Template
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              )
            }
            title="Lista Template"
          />
        </div>

        <ScheduleListComponent schedules={schedules} />
      </div>
    );
  }
  console.log(userData);
  return (
    <div className="container-sub gap-5 !px-2">
      <h4>Nessun template trovato</h4>
      {userData && hasPermission(userData.role as Role, "create:songs") && (
        <>
          <p className="flex flex-row items-center gap-5">
            Aggiungi Template:
            {hasPermission(userData.role as Role, "create:songs") && (
              <Dropdown>
                <DropdownTrigger>
                  <Button color="primary" isIconOnly variant="flat">
                    <FaPlus />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem
                    as={Link}
                    href="/protected/church/personalize/schedule-template/add"
                    key="add"
                    color="primary"
                    variant="flat"
                  >
                    Aggiungi Template
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
          </p>
        </>
      )}
    </div>
  );
}
