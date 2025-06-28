"use client";

import { Input, Button } from "@heroui/react";
import Link from "next/link";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { basicUserData } from "@/utils/types/userData";
import { searchBar, songsListType, songType } from "@/utils/types/types";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";

export default function ItaliansongslistComponent({
  songs,
  userData,
}: {
  songs: songsListType;
  userData: basicUserData;
}) {
  const [songList, setSongList] = useState(songs);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<searchBar>({
    defaultValues: {
      text: "",
    },
  });
  const aggiornaLista = (event: any) => {
    const filteredSongs = songs.filter(
      (song: songType) =>
        song.song_title.toLowerCase().includes(event.text.toLowerCase()) ||
        song.author.toLowerCase().includes(event.text.toLowerCase())
    );

    setSongList(filteredSongs);
  };
  return (
    <>
      <div className="songs-header">
        <h4>Lista canzoni</h4>
        <form
          action=""
          className="songs-searchbar-form"
          onSubmit={handleSubmit(aggiornaLista)}
        >
          <Input
            {...register("text")}
            color="primary"
            type="text"
            placeholder="Cerca canzone"
            className="song-searchbar"
          />
          <Button
            color="primary"
            variant="ghost"
            type="submit"
            disabled={isSubmitting}
          >
            {" "}
            <ManageSearchIcon />
          </Button>
        </form>
        {hasPermission(userData.role as Role, "create:italiansongs") && (
          <Link href="/italiansongs/additaliansong">
            Aggiungi una Canzone Globale!
          </Link>
        )}
      </div>
      <div className="container-song-list">
        {songList.map((song) => {
          return (
            <Link key={song.id} className="songlist-link" href={`/italiansongs/${song.id}`}>
              <div className="song-list" key={song.id}>
                <p key={song.id}>
                  {song.song_title}
                  <br />
                  {song.author && <small>{song.author}</small>}
                  {!song.author && <small>Unknown</small>}
                </p>
                <span className="material-symbols-outlined">
                  <QueueMusicIcon />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
