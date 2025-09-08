"use client";

import { Reorder, useDragControls } from "framer-motion";
import { setListSongT, teamData, TsongNameAuthor } from "@/utils/types/types";
import { MdDragIndicator } from "react-icons/md";

import { RefObject, useEffect } from "react";
import { TitleFormComponent } from "./TitleFormComponentDragAndDrop";
import { SongFormComponent } from "./SongFormComponentDragAndDrop";
import { NoteFormComponent } from "./NoteFormComponentDragAndDrop";

export function ScheduleComponents({
  section,
  index,
  source = "setlist",
  songsList,
  removeItemFromSchedule,

  container,
  updateNotesSection,
  worshipTeams,
  setSchedule,
}: {
  source?: string;
  section: setListSongT;
  index: number;
  songsList: TsongNameAuthor[];
  removeItemFromSchedule: (id: string) => void;

  container: RefObject<null>;
  updateNotesSection: (text: string, section: number) => void;
  worshipTeams: teamData[];
  setSchedule: React.Dispatch<React.SetStateAction<setListSongT[]>>;
}) {
  const controls = useDragControls();
  useEffect(() => {
}, [songsList]);
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
            section={section}
            index={index}
            setSchedule={setSchedule}
          />
        </>
      )}
      {section.type === "song" && (
        <>
          <SongFormComponent
            section={section}
            index={index}
            source={source}
            songsList={songsList}
            worshipTeams={worshipTeams}
            setSchedule={setSchedule}
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
