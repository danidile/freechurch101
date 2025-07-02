"use client";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";

import { Input } from "@heroui/react";
import Link from "next/link";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { basicUserData } from "@/utils/types/userData";
import { searchBar, songsListType, songType } from "@/utils/types/types";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { FaPlus } from "react-icons/fa6";

export default function SongslistComponent({
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
  const normalize = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const aggiornaLista = (event: any) => {
    const searchText = normalize(event.text);

    const filteredSongs = songs.filter((song: songType) => {
      const title = song.song_title ? normalize(song.song_title) : "";
      const author = song.author ? normalize(song.author) : "";
      return title.includes(searchText) || author.includes(searchText);
    });

    setSongList(filteredSongs);
  };

  return (
    <>
      <div className="songs-header">
        <div className="flex-row flex justify-center items-center gap-5">
          <h2>Lista canzoni</h2>
          {hasPermission(userData.role as Role, "create:songs") && (
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly variant="bordered">
                  <FaPlus />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem as={Link} href="/songs/addSong" key="add">
                  Aggiungi canzone
                </DropdownItem>
                <DropdownItem as={Link} href="/artists" key="import">
                  Importa da ChurchLab
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
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
            <ManageSearchIcon />
          </Button>
        </form>
      </div>
      <div className="container-song-list">
        {songList.map((song) => {
          return (
            <Link
              key={song.id}
              href={
                userData.loggedIn
                  ? `/songs/${song.id}`
                  : `/italiansongs/${song.id}`
              }
            >
              <div className="song-list" key={song.id}>
                <div>
                  <p className="font-medium">{song.song_title}</p>
                  {song.author && <small>{song.author}</small>}
                  {!song.author && <small>Unknown</small>}
                </div>
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
