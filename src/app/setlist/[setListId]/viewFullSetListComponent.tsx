"use client";

import { Divider } from "@heroui/react";
import ChordProViewComponent from "@/app/components/chordProViewComponent";
import { setListSongT, setListT } from "@/utils/types/types";

import CustomizeWidget from "@/app/components/CustomizeWidget";
import ChordProViewComponentAlt from "@/app/components/chordProViewComponentAlt";
export default function ViewFullSetListComponent({
  setlistData,
  setlistsongs,
}: {
  setlistData: setListT;
  setlistsongs: setListSongT[];
}) {
  const date = new Date(setlistData.date);
  const readableDate = date.toLocaleString("it-IT", {
    weekday: "long", // "Sunday"
    year: "numeric", // "2024"
    month: "long", // "November"
    day: "numeric", // "10"
  });
  return (
    <>
      <h6>
        <strong>{setlistData.event_title}</strong>
      </h6>
      <p className="capitalize">{readableDate}</p>
      <div className="song-presentation-container">
        {setlistsongs
          .sort((a, b) => a.order - b.order)
          .map((song: setListSongT, index) => {
            console.log("song");
            console.log(song);
            if (song.lyrics)
              return (
                <div key={index}>
                  <ChordProViewComponentAlt
                    source="songs"
                    mode="preview"
                    setListSong={song}
                  />
                  <Divider className="my-14" />
                </div>
              );
          })}
      </div>
    </>
  );
}
