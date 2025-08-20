"use client";

import {
  Input,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import Link from "next/link";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { basicUserData, userData } from "@/utils/types/userData";
import { searchBar, songsListType, songType } from "@/utils/types/types";
import { TbExternalLink } from "react-icons/tb";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { FaPlus } from "react-icons/fa";
import { useUserStore } from "@/store/useUserStore";
import { HeaderCL } from "../components/header-comp";
import { MdOutlineLibraryMusic } from "react-icons/md";

export default function ChurchSongTableComponent({
  songs,
}: {
  songs: songsListType;
}) {
  const { userData } = useUserStore();
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
    <>
      <HeaderCL
        icon={MdOutlineLibraryMusic}
        titleDropDown={
          <div className="flex flex-row items-center justify-center gap-4">
            {hasPermission(userData.role as Role, "create:songs") && (
              <Dropdown>
                <DropdownTrigger>
                  <Button color="default" isIconOnly variant="flat">
                    <FaPlus />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem
                    as={Link}
                    href="/songs/addSong"
                    key="add"
                    color="primary"
                    variant="flat"
                  >
                    Aggiungi canzone
                  </DropdownItem>
                  <DropdownItem
                    as={Link}
                    href="/artists"
                    key="import"
                    color="primary"
                    variant="flat"
                  >
                    Importa da ChurchLab
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
          </div>
        }
        title="Lista canzoni"
        content={
          <form
            action=""
            className="songs-searchbar-form"
            onSubmit={handleSubmit(aggiornaLista)}
          >
            <input
              {...register("text")}
              color="border"
              type="text"
              placeholder="Cerca canzone"
              className="cinput !border-2 !border-black"
            />
            <button
              color="default"
              type="submit"
              className="cinput bg-gray-50 !border-0 !border-gray-50 !max-w-[50px]"
              disabled={isSubmitting}
            >
              <ManageSearchIcon />
            </button>
          </form>
        }
      />
      <div className="max-w-[900px] mx-1">
        <div className="container-song-list w-full min-w-[300px] mx-auto">
          <table
            aria-label="Song list"
            className="w-full table-fixed border-collapse ntable"
          >
            <thead>
              <tr>
                <th className="w-full min-w-[200px]">Title</th>
                <th className="w-3/12">Autore</th>
                <th className="w-3/12">Tag</th>
              </tr>
            </thead>
            <tbody>
              {songList.map((song) => (
                <tr key={song.id}>
                  <td className=" min-w-[200px] max-w-[200px]">
                    <Link href={`/songs/${song.id}`}>
                      <span className="font-medium line-clamp-1">
                        {song.song_title}
                      </span>
                    </Link>
                  </td>

                  <td>
                    <small className="line-clamp-1">
                      {song.author || "Unknown"}
                    </small>
                  </td>
                  <td>
                    <div className="flex flex-row items-center gap-1 flex-wrap">
                      {song?.tags &&
                        song.tags
                          .split(",") // split string into array
                          .map((tag, idx) => (
                            <small
                              key={idx}
                              className=" text-blue-800 font-medium "
                            >
                              {tag.trim()}
                              {", "}
                              {/* trim removes leading/trailing spaces */}
                            </small>
                          ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
