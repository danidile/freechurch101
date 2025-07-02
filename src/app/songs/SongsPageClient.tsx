"use client";

import { useEffect, useState } from "react";
import { getSongs } from "@/hooks/GET/getSongs";
import { useUserStore } from "@/store/useUserStore";
import SongslistComponent from "../components/songslistComponent";
import LoadingSongsPage from "./loading";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { songType } from "@/utils/types/types";
import { Button } from "@heroui/button";
import Link from "next/link";

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

  if (loading || loadingSongs) return <LoadingSongsPage />;

  if (songs && songs.length > 0) {
    return (
      <div className="container-sub">
        <SongslistComponent songs={songs} userData={userData} />
      </div>
    );
  }
  console.log(userData);
  return (
    <div className="container-sub gap-5">
      <h4>Nessuna canzone trovata</h4>
      {userData && hasPermission(userData.role as Role, "create:songs") && (
        <>
          <Button
            color="primary"
            variant="flat"
            as={Link}
            href="/songs/addSong"
          >
            Aggiungi canzone!
          </Button>
          <p>oppure importa canzoni dalla lista di artisti Italiani!</p>
          <Button color="primary" variant="flat" as={Link} href="/artists">
            Importa
          </Button>
        </>
      )}
    </div>
  );
}
