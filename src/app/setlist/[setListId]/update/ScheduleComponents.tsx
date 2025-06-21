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
import { motion, Reorder, useDragControls } from "framer-motion";
import { setListSongT, TsongNameAuthor } from "@/utils/types/types";
import { Button } from "@heroui/button";
import { MdDragIndicator, MdMoreVert } from "react-icons/md";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { MutableRefObject, useEffect, useState } from "react";
import { TitleFormComponent } from "./TitleFormComponentDragAndDrop";
import { SongFormComponent } from "./SongFormComponentDragAndDrop";
import { NoteFormComponent } from "./NoteFormComponentDragAndDrop";

export function ScheduleComponents({
  section,
  index,
  songsList,
  removeItemFromSchedule,
  updateSongtoSetlist,
  updateKey,
  container,
  updateTitleSection,
  updateNotesSection,
}: {
  updateTitleSection: (text: string, section: number) => void;
  section: setListSongT;
  index: number;
  songsList: TsongNameAuthor[];
  removeItemFromSchedule: (id: string) => void;
  updateSongtoSetlist: (song: setListSongT, section: number) => void;
  updateKey: (index: number, value: string) => void;
  container: MutableRefObject<null>;
  updateNotesSection: (text: string, section: number) => void;
}) {
  const sectionIndex = index;
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
  const controls = useDragControls();

  return (
    <Reorder.Item
      key={section.id} // also necessary!
      value={section.id}
      className="setlist-section p-1 bg-white"
      dragConstraints={container}
      dragElastic={0.1}
      dragListener={false}
      dragControls={controls}
      whileDrag={{
        zIndex: 9999,
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      }}
      style={{ position: "relative", zIndex: 0 }}
    >
      <div onPointerDown={(e) => controls.start(e)}>
        <MdDragIndicator color="primary" />
      </div>
      {section.type === "title" && (
        <>
          <TitleFormComponent
            removeItemFromSchedule={removeItemFromSchedule}
            section={section}
            index={index}
            updateTitleSection={updateTitleSection}
          />
        </>
      )}
      {section.type === "song" && (
        <>
          <SongFormComponent
            updateSongtoSetlist={updateSongtoSetlist}
            removeItemFromSchedule={removeItemFromSchedule}
            section={section}
            index={index}
            songsList={songsList}
            updateKey={updateKey}
            container={container}
          />
        </>
      )}
      {section.type === "note" && (
        <>
          <NoteFormComponent
            removeItemFromSchedule={removeItemFromSchedule}
            section={section}
            index={index}
            updateNotesSection={updateNotesSection}
          />
        </>
      )}
    </Reorder.Item>
  );
}
