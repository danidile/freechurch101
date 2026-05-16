"use client";
import { CgArrowsExchange } from "react-icons/cg";
import { setListSongT, songType } from "@/utils/types/types";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { FaPlus } from "react-icons/fa";

import {
  Button,
  Input,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
} from "@heroui/react";

import { useState } from "react";

export function SelectSongsDrawer({
  songsList,
  addOrUpdatefunction,
  type,
  section,
}: {
  type: string;
  songsList: setListSongT[];
  addOrUpdatefunction: (song: setListSongT, section: number) => void;
  section: number;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [songs, setSongs] = useState(songsList);
  const [searchText, setSearchText] = useState(""); // Local state for search input

  const aggiornaLista = () => {
    const filteredSongs = songsList.filter(
      (song: setListSongT) =>
        song.song_title.toLowerCase().includes(searchText.toLowerCase()) ||
        song.author.toLowerCase().includes(searchText.toLowerCase())
    );
    setSongs(filteredSongs);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      aggiornaLista(); // Trigger search on Enter key
    }
  };

  // END SEARCHBAR DATA

  return (
    <>
      {type === "add" && (
        <Button
          isIconOnly
          color="primary"
          size="lg"
          className="mr-0"
          onPress={onOpen}
        >
          <FaPlus />
        </Button>
      )}
      {type === "update" && (
        <Button
          size="sm"
          isIconOnly
          variant="light"
          className="p-0"
          onPress={onOpen}
        >
          <CgArrowsExchange size={25} />
        </Button>
      )}

      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                Aggiungi Canzone
              </DrawerHeader>
              <DrawerBody>
                <>
                  <div className="songs-header">
                    <h4>Lista canzoni</h4>
                    <div className="songs-searchbar-form">
                      <Input
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)} // Update local state
                        color="primary"
                        type="text"
                        placeholder="Cerca canzone"
                        className="song-searchbar"
                        onKeyDown={handleKeyDown} // Listen for Enter key
                      />
                      <Button
                        color="primary"
                        variant="ghost"
                        onPress={() => aggiornaLista()} // Handle search
                      >
                        <ManageSearchIcon />
                      </Button>
                    </div>

                    <div className="container-song-list">
                      {songs.map((song, index) => {
                        return (
                          <div
                            style={{ cursor: "pointer" }}
                            key={(song.id + index).toString()}
                            onClick={() => {
                              addOrUpdatefunction(song, section);
                              onClose();
                            }}
                          >
                            <p className="song-card-searchBar">
                              {song.song_title}
                              <br />
                              {song.author ? (
                                <small>{song.author}</small>
                              ) : (
                                <small>Unknown</small>
                              )}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              </DrawerBody>
              <DrawerFooter>
                <Button fullWidth color="primary" onPress={onClose}>
                  Chiudi
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
