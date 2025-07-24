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
        <div className="flex items-center border-b p-1 text-sm">
          <div className="w-1/2 truncate ">
            {element.song_title || (
              <span className="text-gray-400 ">Canzone da scegliere</span>
            )}
          </div>
          {element.singerName && (
            <div className="w-1/2 px-2 text-clip border-l-1 border-gray-300 ml-2">
              {element.singerName}
            </div>
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
