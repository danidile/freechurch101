import { getSetList } from "@/hooks/GET/getSetList";
import { getSetListSongs } from "@/hooks/GET/getSetListSongs";
import { FaCheck } from "react-icons/fa";
import { FaCircle } from "react-icons/fa6";
import ModalLyrics from "./modalLyrics";
import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "@/utils/supabase/getUserData";
import CopyLinkButton from "@/app/components/CopyLinkButton";
import {
  GroupedMembers,
  setListSongT,
  setListT,
} from "@/utils/types/types";
import MoreDropdownSetlist from "./MoreDropdownSetlist";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { getSetListTeams } from "@/hooks/GET/getSetListTeams";
import Link from "next/link";
import { Button } from "@heroui/button";

export default async function Page({
  params,
}: {
  params: { setListId: string };
}) {
  const setlistData: setListT = await getSetList(params.setListId);

  let setlistsongs: setListSongT[] = await getSetListSongs(params.setListId);
  let setlistTeams: GroupedMembers = await getSetListTeams(params.setListId);

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
        <div className="team-show">
          <h6>
            <strong className="capitalize">{setlistData.event_title}</strong>
          </h6>
          <p className="capitalize">{readableDate}</p>

          {userData &&
            hasPermission(userData.role as Role, "create:setlists") && (
              <div className="top-settings-bar">
                <CopyLinkButton />

                <MoreDropdownSetlist setlistId={params.setListId} />
              </div>
            )}
        </div>

        {setlistsongs
          .sort((a, b) => a.order - b.order)
          .map((song: any, index) => {
            return (
              <>
                <div key={"Song" + index} className="setlist-list-id">
                  <p>
                    <strong>{song.song_title}</strong> {" - "}
                    {song.key}
                  </p>
                  <ModalLyrics songData={song} />
                </div>
              </>
            );
          })}

        {setlistsongs.length > 0 && (
          <div className="center- gap-3 mt-5 mb-20">
            <Link  href={`/setlist/${params.setListId}/view`}>
              <Button color="primary"> Visualizza set completo</Button>
            </Link>
          </div>
        )}

        {Object.entries(setlistTeams).map((team) => {
          return (
            <>
              <div className="team-show">
                <h5>{team[0]}</h5>
                {team[1].map((member) => {
                  return (
                    <div className="flex gap-2 items-center">
                      {member.status === "pending" && (
                        <FaCircle color="orange" size={10} />
                      )}
                      {member.status === "confirmed" && (
                        <FaCheck color="green" size={10} />
                      )}
                      {member.status === "denied" && (
                        <FaCircle color="red" size={10} />
                      )}
                      {member.name + " " + member.lastname}
                    </div>
                  );
                })}
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
}
