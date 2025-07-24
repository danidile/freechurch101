"use client";

import ModalLyrics from "@/app/people/[peopleId]/modalLyrics";
import { setListSongT } from "@/utils/types/types";

export function ScheduleViewComponents({ element }: { element: setListSongT }) {
  return (
    <div className="schedule-view-container">
      {element.type === "title" && (
        <p className="schedule-title">{element.title}</p>
      )}
      {element.type === "song" && (
        <div className="flex items-center border-b p-1 ">
          {element.song_title ? (
            <p className="w-1/2 truncate">{element.song_title}</p>
          ) : (
            <p className="text-gray-400 w-1/2 truncate">Canzone da scegliere</p>
          )}
          {element.singerName && (
            <p className="w-1/2 px-2 text-clip border-l-1 border-gray-300 ml-2">
              {element.singerName}
            </p>
          )}
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
