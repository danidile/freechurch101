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

  useEffect(() => {
    const fetchData = async () => {
      // Step 1: Ensure user is fetched
      if (!userData.loggedIn && !loading) {
        await fetchUser();
      }

      // Step 2: Once user is available, fetch songs
      if (userData.loggedIn && !loading) {
        const fetchedSongs = await getSongs(userData);
        setSongs(fetchedSongs);
        setLoadingSongs(false);
      }
    };

    fetchData();
  }, [userData.loggedIn, loading]);

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
