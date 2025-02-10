// @ts-nocheck
import { getSetList } from "@/hooks/GET/getSetList";
import { getSetListSongs } from "@/hooks/GET/getSetListSongs";
import { Button, Link } from "@heroui/react";
import ModalLyrics from "./modalLyrics";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import ButtonDeleteSetlist from "./buttonDeleteSetlist";
import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "@/utils/supabase/getUserData";
import CopyLinkButton from "@/app/components/CopyLinkButton";
export default async function Page({
  params,
}: {
  params: { setListId: string };
}) {
  const setlistData = await getSetList(params.setListId);
  let setlistsongs = await getSetListSongs(params.setListId);
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

  const userData: basicUserData = await fbasicUserData();
  console.log(setlistsongs);
  return (
    <div className="container-sub">
      <div className="song-presentation-container">
        <h6>
          <strong>{setlistData.church.church_name}</strong>
        </h6>
        <p>{readableDate}</p>

        {setlistsongs
          .sort((a, b) => a.order - b.order)
          .map((song, index) => {
            const songData = [
              song.songTitle,
              song.author,
              song.lyrics,
              song.key,
              song.upload_key,
            ];
            let toggle = true;
            if (index > 0) {
              toggle = false;
            }
            return (
              <>
                {toggle && (
                  <div key={"List" + index} className="setlist-song">
                    <p>Titolo Canzone</p>
                    <p className="center-">
                      <MusicNoteIcon fontSize="small" />
                    </p>
                    <p className="center-">
                      <RemoveRedEyeIcon fontSize="small" />
                    </p>
                  </div>
                )}
                <div key={"Song" + index} className="setlist-song">
                  <p>
                    <strong>{song.songTitle}</strong> <br />
                  </p>
                  <div className="key-button">{song.key}</div>
                  <ModalLyrics songData={song} />
                </div>
              </>
            );
          })}
        <br />
        <br />
        <div className="center- gap-3">
          <Link href={`/setlist/view/${params.setListId}`}>
            <Button color="primary" variant="flat">
              Visualizza set completo
            </Button>
          </Link>
          {["1", "2"].includes(userData.role.toString()) && (
            <ButtonDeleteSetlist setlistID={params.setListId} />
          )}
          <span className="material-symbols-outlined">
          <CopyLinkButton/>
          </span>
        </div>
      </div>
    </div>
  );
}
