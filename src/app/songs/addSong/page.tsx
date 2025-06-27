"use client";
import { songSchema } from "@/utils/types/types";
import UpdateSongForm from "../[songId]/update/updateSongForm";

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

  return <UpdateSongForm songData={songData} type="add" />;
}
