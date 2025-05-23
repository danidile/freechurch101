"use client";
import { setListSongT, songType } from "@/utils/types/types";
import { Button } from "@heroui/button";
import { formatSetlistSongs } from "./formatSetlistSongsAction";

export const FormatSetlistSongs = ({
  setlistsongs,
}: {
  setlistsongs: setListSongT[];
}) => {
  const formattaCanzoni = async (data: setListSongT[]) => {
    await formatSetlistSongs(data);
    console.log("songs ImpoRted");
  };

  return (
    <div className="container-sub">
      <Button onPress={() => formattaCanzoni(setlistsongs)}>Hello</Button>
      {setlistsongs &&
        setlistsongs.map((song) => {
          return <p>{song.song_title}</p>;
        })}
    </div>
  );
};
