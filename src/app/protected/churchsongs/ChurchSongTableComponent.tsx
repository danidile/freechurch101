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
import { TbExternalLink } from "react-icons/tb";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";

export default function ChurchSongTableComponent({
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
    <div className="max-w-[1324px]">
      <div className="songs-header">
        <h3>Lista canzoni</h3>
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
        {hasPermission(userData.role as Role, "create:songs") && (
          <Button
            color="primary"
            variant="ghost"
            className="my-3"
            as={Link}
            href="/songs/addSong"
            disabled={isSubmitting}
          >
            Aggiungi una canzone!
          </Button>
        )}
      </div>
      <div className="container-song-list w-full min-w-[300px] mx-auto">
        <Table
          aria-label="Song list"
          className="w-full table-fixed border-collapse"
        >
          <TableHeader>
            <TableColumn className="w-1/3">Title</TableColumn>
            <TableColumn className="w-1/12">Author</TableColumn>
            <TableColumn className="w-1/3">Tonalità</TableColumn>
            <TableColumn className="w-1/12">Apri</TableColumn>
          </TableHeader>
          <TableBody>
            {songList.map((song) => (
              <TableRow key={song.id}>
                <TableCell className="truncate">
                  <span className="font-medium">{song.song_title}</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{song.upload_key}</span>
                </TableCell>
                <TableCell>
                  <small>{song.author || "Unknown"}</small>
                </TableCell>
                <TableCell>
                  <Button size="sm" color="primary" isIconOnly as={Link} href={`/songs/${song.id}`} >
                    <TbExternalLink size={20} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
