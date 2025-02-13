import { getSetList } from "@/hooks/GET/getSetList";
import { getSetListSongs } from "@/hooks/GET/getSetListSongs";
import { Divider } from "@heroui/react";
import ChordProViewComponent from "@/app/components/chordProViewComponent";
import { setListSongT, setListT } from "@/utils/types/types";
export default async function Page({
  params,
}: {
  params: { setListId: string };
}) {
  const setlistData: setListT = await getSetList(params.setListId);
  const setlistsongs: setListSongT[] = await getSetListSongs(params.setListId);
  const date = new Date(setlistData.date);
  const readableDate = date.toLocaleString("it-IT", {
    weekday: "long", // "Sunday"
    year: "numeric", // "2024"
    month: "long", // "November"
    day: "numeric", // "10"
  });
  return (
    <div className="container-sub">
      <div className="w-full">
        <div className="song-presentation-container">
          <h6>
            <strong>{setlistData.event_title}</strong>
          </h6>
          <p>{readableDate}</p>

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
      </div>
    </div>
  );
}
