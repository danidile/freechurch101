"use client";

import { useEffect, useState } from "react";
import { getSongs } from "@/hooks/GET/getSongs";
import { useUserStore } from "@/store/useUserStore";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { songType } from "@/utils/types/types";
import { Button } from "@heroui/button";
import Link from "next/link";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { FaPlus } from "react-icons/fa";
import ChurchSongTableComponent from "./ChurchSongTableComponent";
import ChurchLabLoader from "../components/churchLabSpinner";

export default function SongsPageClient() {
  const { userData, loading } = useUserStore();
  const [songs, setSongs] = useState<songType[] | null>(null);
  const [loadingSongs, setLoadingSongs] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      const fetchedSongs = await getSongs(userData);
      setSongs(fetchedSongs);
      setLoadingSongs(false);
    };
    fetchSongs();
  }, [userData?.loggedIn]);

  if (loading || loadingSongs) return <ChurchLabLoader />;

  if (songs && songs.length > 0) {
    return (
      <div className="container-sub ">
        <ChurchSongTableComponent songs={songs} />
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
