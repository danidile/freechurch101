// @ts-nocheck
import { getSetList } from "@/utils/supabase/getSetList";
import { getSetListSongs } from "@/utils/supabase/getSetListSongs";

import { Button,Divider } from "@nextui-org/react";
import ModalLyrics from "./modalLyrics";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import ChordProViewComponent from "@/app/components/chordProViewComponent";
export default async function Page({
  params,
}: {
  params: { setListId: string };
}) {
  const setlistData = await getSetList(params.setListId);
  const setlistsongs = await getSetListSongs(params.setListId);
  const date = new Date(setlistData.date);
  const readableDate = date.toLocaleString("it-IT", {
    weekday: "long", // "Sunday"
    year: "numeric", // "2024"
    month: "long", // "November"
    day: "numeric", // "10"
    // hour: "2-digit", // "10"
    // minute: "2-digit", // "22"
    // second: "2-digit", // "46"
  });
  return (
    <div className="container-sub">
      <div className="w-full">
      <div className="song-presentation-container">
        <h6>
          <strong>{setlistData.church.church_name}</strong>
        </h6>
        <p>{readableDate}</p>

        {setlistsongs.sort((a, b) => a.order - b.order).map((song, index) => {
          
          return (
            <>
                <ChordProViewComponent songData={song} showExtra={true}/>
                <Divider className="my-14" />

            </>

          );
        })}
      </div>
      </div>
    </div>
  );
}
