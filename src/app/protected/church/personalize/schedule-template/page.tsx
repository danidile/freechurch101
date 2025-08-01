"use client";

import { useEffect, useState } from "react";
import { getSongs } from "@/hooks/GET/getSongs";
import { useUserStore } from "@/store/useUserStore";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { scheduleTemplate, songType } from "@/utils/types/types";
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

export default function SongsPageClient() {
  const { userData, loading } = useUserStore();
  const [schedules, setSchedules] = useState<scheduleTemplate[] | null>([]);
  const [loadingSongs, setLoadingSongs] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      const fetchedTemplates = await getChurchScheduleTemplates(
        userData.church_id
      );
      setSchedules(fetchedTemplates);
      setLoadingSongs(false);
    };
    fetchSongs();
  }, [userData?.loggedIn]);

  // if (loading || loadingSongs) return <LoadingSongsPage />;

  if (schedules && schedules.length > 0) {
    return (
      <div className="container-sub">
        <ScheduleListComponent schedules={schedules} />
      </div>
    );
  }
  console.log(userData);
  return (
    <div className="container-sub gap-5 !px-2">
      <h4>Nessuna canzone trovata</h4>
      {userData && hasPermission(userData.role as Role, "create:songs") && (
        <>
          <p className="flex flex-row items-center gap-5">
            Aggiungi canzone:
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
                    href="/songs/addSong"
                    key="add"
                    color="primary"
                    variant="flat"
                  >
                    Aggiungi canzone
                  </DropdownItem>
                  <DropdownItem
                    as={Link}
                    href="/artists"
                    key="import"
                    color="primary"
                    variant="flat"
                  >
                    Importa da ChurchLab
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
