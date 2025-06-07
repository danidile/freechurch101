"use client";

import { useEffect, useState } from "react";
import { getSongs } from "@/hooks/GET/getSongs";
import { useUserStore } from "@/store/useUserStore";
import SongslistComponent from "../components/songslistComponent";
import LoadingSongsPage from "./loading";

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
    <div className="container-sub">
      <h1>No songs found</h1>
      {/* <a href="/songs/addSong">Add a New Song!</a> */}
    </div>
  );
}
