"use client";

import { Divider } from "@heroui/react";
import ChordProViewComponent from "@/app/components/chordProViewComponent";
import { setListSongT, setListT } from "@/utils/types/types";
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
      <Button onPress={onOpen} color="primary" variant="flat">
        Visualizza set completo
      </Button>

      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="full">
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1 bg-slate-50">
                <h6>
                  <strong>{setlistData.event_title}</strong>
                </h6>
                <p>{readableDate}</p>
              </DrawerHeader>
              <DrawerBody>
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
