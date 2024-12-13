"use client";

import { Input, Button } from "@nextui-org/react";
import Link from "next/link";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import { useState } from "react";
import { useForm } from "react-hook-form";
type searchBar = {
  text: string;
};

type songsListType = {
  songs:{
    id: string;
    created_at: string;
    song_title: string;
    lyrics: string;
    author: string;
    upload_key: string;
  }[];
};


export default function SongslistComponent({ songs }: songsListType) {
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
    const filteredSongs = songs.filter((song) =>
      song.song_title.toLowerCase().includes(event.text.toLowerCase()) ||
      song.author.toLowerCase().includes(event.text.toLowerCase())
    );
  
    const result: songsListType = { songs: filteredSongs }; // Avvolgi in un oggetto con chiave 'songs'
    console.log(result);
    setSongList(result.songs);
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
        <Button color="primary" variant="ghost">
          <a href="/songs/addSong">Aggiungi una canzone!</a>
        </Button>
      </div>
      <div className="container-song-list">
        {songList.map((song) => {
          return (
            <Link className="songlist-link" href={`/songs/${song.id}`}>
              <div className="song-list" key={song.id}>
                <p key={song.id}>
                  {song.song_title}
                  <br />
                  <small>{song.author}</small>{" "}
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
