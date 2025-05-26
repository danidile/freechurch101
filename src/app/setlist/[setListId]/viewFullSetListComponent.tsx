"use client";

import { Divider, Tooltip } from "@heroui/react";
import ChordProViewComponent from "@/app/components/chordProViewComponent";
import { setListSongT, setListT } from "@/utils/types/types";
import { IoCloseSharp } from "react-icons/io5";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Button,
  useDisclosure,
} from "@heroui/react";
import CustomizeWidget from "@/app/components/CustomizeWidget";
export default function ViewFullSetListComponent({
  setlistData,
  setlistsongs,
}: {
  setlistData: setListT;
  setlistsongs: setListSongT[];
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const date = new Date(setlistData.date);
  const readableDate = date.toLocaleString("it-IT", {
    weekday: "long", // "Sunday"
    year: "numeric", // "2024"
    month: "long", // "November"
    day: "numeric", // "10"
  });
  return (
    <>
      <CustomizeWidget />

      <h6>
        <strong>{setlistData.event_title}</strong>
      </h6>
      <p>{readableDate}</p>
      <div className="song-presentation-container">
        {setlistsongs
          .sort((a, b) => a.order - b.order)
          .map((song: setListSongT, index) => {
            console.log("song");
            console.log(song);
            return (
              <div>
                <ChordProViewComponent setListSong={song} />
                <Divider className="my-14" />
              </div>
            );
          })}
      </div>
    </>
  );
}
