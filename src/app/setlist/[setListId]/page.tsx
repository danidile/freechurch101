import { getSetList } from "@/hooks/GET/getSetList";
import { getSetListSongs } from "@/hooks/GET/getSetListSongs";
import {
  Button,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import ModalLyrics from "./modalLyrics";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import ButtonDeleteSetlist from "./buttonDeleteSetlist";
import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "@/utils/supabase/getUserData";
import CopyLinkButtonWithText from "@/app/components/CopyLinkButtonWithText";
import CopyLinkButton from "@/app/components/CopyLinkButton";
import { MdMoreVert } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { setListSongT, setListT } from "@/utils/types/types";
import ViewFullSetListComponent from "./viewFullSetListComponent";

export default async function Page({
  params,
}: {
  params: { setListId: string };
}) {
  const setlistData: setListT = await getSetList(params.setListId);

  let setlistsongs: setListSongT[] = await getSetListSongs(params.setListId);
  const date = new Date(setlistData.date);
  const readableDate = date.toLocaleString("it-IT", {
    weekday: "long", // "Sunday"
    year: "numeric", // "2024"
    month: "long", // "November"
    day: "numeric", // "10"
  });

  const userData: basicUserData = await fbasicUserData();
  return (
    <div className="container-sub">
      <div className="song-presentation-container">
        <h6>
          <strong>{setlistData.event_title}</strong>
        </h6>
        <p>{readableDate}</p>
        <div className="top-settings-bar">
          <div>
            <Popover placement="bottom" showArrow={true}>
              <PopoverTrigger>
                <Button isIconOnly radius="full">
                  <MdMoreVert className="text-2xl" />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="px-1 py-2 flex-col gap-2">
                  <div>
                    <Link href={`/setlist/${params.setListId}/update`}>
                      <Button fullWidth size="md" variant="light">
                        <FaEdit /> Aggiorna
                      </Button>
                    </Link>
                  </div>
                  <div className="my-1">
                    <CopyLinkButtonWithText />
                  </div>
                  {["1", "2"].includes(userData.role.toString()) && (
                    <ButtonDeleteSetlist setlistID={params.setListId} />
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {setlistsongs
          .sort((a, b) => a.order - b.order)
          .map((song: any, index) => {
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
                    <p>
                      <RemoveRedEyeIcon fontSize="small" />
                    </p>
                  </div>
                )}
                <div key={"Song" + index} className="setlist-song">
                  <p>
                    <strong>{song.song_title}</strong> <br />
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
          <ViewFullSetListComponent
            setlistData={setlistData}
            setlistsongs={setlistsongs}
          />

          <span className="material-symbols-outlined">
            <CopyLinkButton />
          </span>
        </div>
      </div>
    </div>
  );
}
