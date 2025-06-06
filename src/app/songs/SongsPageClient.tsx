"use client";

import { useEffect, useState } from "react";
import { getSongs } from "@/hooks/GET/getSongs";
import { useUserStore } from "@/store/useUserStore";
import SongslistComponent from "../components/songslistComponent";
import LoadingSongsPage from "./loading";

export default function SongsPageClient() {
  const { userData, fetchUser, loading } = useUserStore();
  const [songs, setSongs] = useState<any[] | null>(null);
  const [loadingSongs, setLoadingSongs] = useState(true);

  // Step 1: Make sure user is fetched on first mount
  useEffect(() => {
    if (!userData.loggedIn) {
      fetchUser();
    }
  }, []);

  // Step 2: Once user is available, fetch songs
  useEffect(() => {
    if (!loading && userData.loggedIn) {
      getSongs(userData).then((fetchedSongs) => {
        setSongs(fetchedSongs);
        setLoadingSongs(false);
      });
    }
  }, [loading, userData]);

  if (loading || loadingSongs || !userData.loggedIn)
    return <LoadingSongsPage />;

  if (songs && songs.length > 0) {
    return (
      <div className="container-sub">
        <SongslistComponent songs={songs} userData={userData} />
      </div>
    );
  }

  return (
    <div className="container-sub">
      <h1>No songs found</h1>
      <a href="/songs/addSong">Add a New Song!</a>
    </div>
  );
}
