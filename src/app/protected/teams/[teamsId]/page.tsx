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
import { setListSongT, setListT, Team } from "@/utils/types/types";
import ViewFullSetListComponent from "./viewFullSetListComponent";
import { getTeamsByChurch } from "@/hooks/GET/getTeamsByChurch";

export default async function Page({
  params,
}: {
  params: { teamsId: string };
}) {
    const userData: basicUserData = await fbasicUserData();
    const churchTeams: Team[] = await getTeamsByChurch(userData.church_id);
    console.log("churchTeams");
    console.log(churchTeams);
  const setlistData: setListT = await getSetList("b37949a5-bfd3-45ab-8aaf-6056e7001f81");

  let setlistsongs: setListSongT[] = await getSetListSongs("b37949a5-bfd3-45ab-8aaf-6056e7001f81");

  return (
    <div className="container-sub">
      <div className="song-presentation-container">
        <h6>
          <strong>{setlistData.event_title}</strong>
        </h6>
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
                    <Link href={`/setlist/18f7b149-90f2-4e6e-8a34-9edf4d9f2874/update`}>
                      <Button fullWidth size="md" variant="light">
                        <FaEdit /> Aggiorna
                      </Button>
                    </Link>
                  </div>
                  <div className="my-1">
                    <CopyLinkButtonWithText />
                  </div>
                  {["1", "2"].includes(userData.role.toString()) && (
                    <ButtonDeleteSetlist setlistID={"18f7b149-90f2-4e6e-8a34-9edf4d9f2874"} />
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
