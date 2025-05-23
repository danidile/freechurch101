"use client";
import { songType } from "@/utils/types/types";
import { Button } from "@heroui/button";
import { importSongs } from "./importSongsAction";

export const ImportaCanzoni = ({
  updatedSongs,
}: {
  updatedSongs: songType[];
}) => {
  const importaCanzoni = async (data: songType[]) => {
    // await importSongs(data);
    console.log("songs ImpoRted");
  };
  console.log(updatedSongs);

  return <Button onPress={() => importaCanzoni(updatedSongs)}>Hello</Button>;
};
