"use client";

import { Input, Button } from "@heroui/react";
import Link from "next/link";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { basicUserData } from "@/utils/types/userData";
import { searchBar, songsListType, songType } from "@/utils/types/types";
import { TbExternalLink } from "react-icons/tb";

export default function ChurchSongTableComponent({
  songs,
}: {
  songs: songsListType;
}) {
  const [songList, setSongList] = useState(songs);
  console.log(songs);
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
      </div>
      <div className="container-song-list w-full min-w-[300px] mx-auto">
        <table
          aria-label="Song list"
          className="w-full table-fixed border-collapse ntable"
        >
          <thead>
            <th className="w-9/12 min-w-[200px]">Title</th>
            <th className="w-3/12">Autore</th>
            <th className="w-3/12">Tag</th>
            <td className="w-1/12 !text-center">Apri</td>
          </thead>
          <tbody>
            {songList.map((song) => (
              <tr key={song.id}>
                <td>
                  <span className="font-medium line-clamp-1">
                    {song.song_title}
                  </span>
                </td>

                <td>
                  <small className="line-clamp-1">
                    {song.author || "Unknown"}
                  </small>
                </td>
                <td>
                  <div className="flex flex-row items-center items-center gap-1 flex-wrap">
                    {song?.tags &&
                      song.tags.map((tag, idx) => (
                        <small
                          key={idx}
                          className="bg-blue-100 text-blue-800  font-medium px-3 py-1 rounded-full"
                        >
                          {tag}
                        </small>
                      ))}
                  </div>
                </td>

                <td className="!text-center">
                  <Button
                    size="sm"
                    color="primary"
                    isIconOnly
                    as={Link}
                    href={`/songs/${song.id}`}
                  >
                    <TbExternalLink size={20} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
