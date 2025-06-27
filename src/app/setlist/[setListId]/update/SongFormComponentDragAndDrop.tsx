"use client";
import { keys } from "@/constants";

import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { Select, SelectItem } from "@heroui/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";

import { Input } from "@heroui/input";
import { motion, Reorder } from "framer-motion";
import { setListSongT, TsongNameAuthor } from "@/utils/types/types";
import { Button } from "@heroui/button";
import { MdMoreVert } from "react-icons/md";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { MutableRefObject, useEffect, useState } from "react";

export function SongFormComponent({
  section,
  index,
  songsList,
  removeItemFromSchedule,
  updateSongtoSetlist,
  updateKey,
  container,
}: {
  section: setListSongT;
  index: number;
  songsList: TsongNameAuthor[];
  removeItemFromSchedule: (id: string) => void;
  updateSongtoSetlist: (song: setListSongT, section: number) => void;
  updateKey: (index: number, value: string) => void;
  container: MutableRefObject<null>;
}) {
  const sectionIndex = index;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [songs, setSongs] = useState(songsList);
  const [searchText, setSearchText] = useState(""); // Local state for search input

    const normalize = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const aggiornaLista = () => {
    const filteredSongs = songsList.filter(
      (song: setListSongT) =>
        song.song_title?.toLowerCase().includes(searchText.toLowerCase()) ||
        song.author?.toLowerCase().includes(searchText.toLowerCase())
    );
    setSongs(filteredSongs);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      aggiornaLista(); // Trigger search on Enter key
    }
  };

  return (
    <div
      className="setlist-section"
      // dragConstraints={container}
    >
      <p>
        {section.song_title}
        {!section.song_title && <>Seleziona Canzone</>}
      </p>
      <Select
        size="sm"
        className="key-selector"
        defaultSelectedKeys={
          new Set([keys.includes(section.key) ? section.key : keys[0]])
        }
        onChange={(e) => {
          const newKey = e.target.value;
          updateKey(index, newKey); // Pass the actual key value
        }}
        aria-label="tonalità"
      >
        {keys.map((key) => (
          <SelectItem id={key} key={key}>
            {key}
          </SelectItem>
        ))}
      </Select>
      <Dropdown>
        <DropdownTrigger>
          <Button
            isIconOnly
            radius="full"
            variant="light"
            size="sm"
            className="mr-0"
          >
            <MdMoreVert className="text-2xl" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem
            key="update"
            as={Button}
            className="p-1"
            onPress={onOpen}
            variant="light"
          >
            {section.song_title && <>Modifica canzone</>}
            {!section.song_title && <>Seleziona canzone</>}
          </DropdownItem>
          <DropdownItem
            key="delete"
            className="p-1 selection:"
            as={Button}
            color="danger"
            variant="light"
            id={section.id}
            onPress={() => removeItemFromSchedule(section.id)}
            accessKey={String(index)}
          >
            Elimina
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Modal
        placement="center"
        scrollBehavior="inside"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        radius="none"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h6>Lista canzoni</h6>
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
              </ModalHeader>
              <ModalBody>
                <>
                  <div className="songs-header">
                    <div className="container-song-list">
                      {songs.map((song, index) => {
                        return (
                          <div
                            style={{ cursor: "pointer" }}
                            key={(song.id + index).toString()}
                            onClick={() => {
                              updateSongtoSetlist(song, sectionIndex);
                              onClose();
                            }}
                          >
                            <div className=" flex flex-col gap-0">
                              <p>{song.song_title}</p>
                              <small>
                                {song.author ? (
                                  <>{song.author}</>
                                ) : (
                                  <>Unknown</>
                                )}
                              </small>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              </ModalBody>
              <ModalFooter>
                <Button fullWidth color="primary" onPress={onClose}>
                  Chiudi
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
