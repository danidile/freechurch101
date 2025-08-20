"use client";
import { songSchema } from "@/utils/types/types";
import UpdateSongForm from "../[songId]/update/updateSongForm";
import { HeaderCL } from "@/app/components/header-comp";
import { MdOutlineLibraryMusic } from "react-icons/md";

export default function Page() {
  const id = "";
  const upload_key = "";
  const lyrics = "";
  const album = "";

  const songData: songSchema = {
    song_title: "",
    id,
    upload_key,
    lyrics,
    album,
  };

  return (
    <div className="container-sub">
      <HeaderCL icon={MdOutlineLibraryMusic} title="Crea canzone" />
      <UpdateSongForm songData={songData} type="add" />
    </div>
  );
}
