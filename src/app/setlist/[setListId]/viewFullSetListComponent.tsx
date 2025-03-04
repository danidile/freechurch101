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
      <Button onPress={onOpen} color="primary">
        Visualizza set completo
      </Button>

      <Drawer
        hideCloseButton
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="full"
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="py-1 px-1 bg-transparent">
                <Tooltip content="Close" className="">
                  <Button
                    isIconOnly
                    className="text-default-400 mr-0"
                    size="md"
                    radius="full"
                    color="danger"
                    variant="flat"
                    onPress={onClose}
                  >
                    <IoCloseSharp className="text-red-500 " />
                  </Button>
                </Tooltip>
              </DrawerHeader>
              <DrawerBody>
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
                        <>
                          <ChordProViewComponent setListSong={song} />
                          <Divider className="my-14" />
                        </>
                      );
                    })}
                </div>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
