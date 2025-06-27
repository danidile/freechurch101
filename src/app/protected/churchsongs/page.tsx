"use client";

import { useEffect, useState } from "react";
import { getSongs } from "@/hooks/GET/getSongs";
import { useUserStore } from "@/store/useUserStore";

import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import ChurchSongTableComponent from "./ChurchSongTableComponent";

export default function SongsPageClient() {
  const { userData, loading } = useUserStore();
  const [songs, setSongs] = useState<any[] | null>(null);
  const [loadingSongs, setLoadingSongs] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      const fetchedSongs = await getSongs(userData);
      setSongs(fetchedSongs);
      setLoadingSongs(false);
    };
    fetchSongs();
  }, [userData?.loggedIn]);

  if (loading || loadingSongs) return <p>loading</p>;

  if (songs && songs.length > 0) {
    return (
        <ChurchSongTableComponent songs={songs} userData={userData} />
    );
  }
  console.log(userData);
  return (
    <div className="container-sub">
      <h1>No songs found</h1>
      {userData && hasPermission(userData.role as Role, "create:songs") && (
        <a href="/songs/addSong">Aggiungi canzone!</a>
      )}{" "}
    </div>
  );
}
