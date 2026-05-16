"use server";

import { getSongById } from "@/hooks/GET/getSongById";

export const getSongFunc = async (songData: unknown) => {
    const song = await getSongById(songData);
    return song;
  };



