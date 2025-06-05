import { getSetList } from "@/hooks/GET/getSetList";
import UpdateSetlistForm from "./UpdateSetlistForm";
import {
  churchMembersT,
  setListSongT,
  setListT,
  teamData,
} from "@/utils/types/types";
import { getSongsCompact } from "@/hooks/GET/getSongsCompact";
import { getSetListSongsCompact } from "@/hooks/GET/getSetListSongsCompact";
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";
import { getChurchWorshipTeam } from "@/hooks/GET/getChurchWorshipTeam";

import { getSelectedChurchTeams } from "@/hooks/GET/getSelectedChurchTeams";
export default async function songs({
  params,
}: {
  params: { setListId: string };
}) {
  let setlistData: setListT = await getSetList(params.setListId);
  let setlistsongs: setListSongT[] = await getSetListSongsCompact(
    params.setListId
  );
  const userData: basicUserData = await fbasicUserData();

  const worshipTeamMembers: churchMembersT[] = await getChurchWorshipTeam(
    userData.church_id
  );
  let setlistTeams: teamData[] = await getSelectedChurchTeams(
    userData.church_id,
    params.setListId
  );
  setlistData.teams = setlistTeams;

  setlistData.setListSongs = setlistsongs;
  const songs = await getSongsCompact();
    return (
      <div className="container-sub">
        <UpdateSetlistForm
          teams={setlistTeams}
          page="update"
          setlistData={setlistData}
          songsList={songs}
        />
      </div>
    );
  
}
