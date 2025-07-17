"use client";

import ModalLyrics from "@/app/people/[peopleId]/modalLyrics";
import { setListSongT } from "@/utils/types/types";

export function ScheduleViewComponents({ element }: { element: setListSongT }) {
  return (
    <div className="schedule-view-container">
      {element.type === "title" && (
        <div className="schedule-title">{element.title}</div>
      )}
      {element.type === "song" && (
        <div className="schedule-song">
          <p>
            {element.song_title}
            {!element.song_title && <>Canzone da scegliere</>}
          </p>
          <p className="font-bold">{element.key} </p>
        </div>
      )}
      {element.type === "note" && (
        <div className="schedule-note">
          {element?.note &&
            element?.note?.split("\n").map((line, index) => (
              <p key={index} className="leading-5">
                {line}
              </p>
            ))}
        </div>
      )}
    </div>
  );
}
