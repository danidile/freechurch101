import { getSetList } from "@/hooks/GET/getSetList";
import UpdateSetlistForm from "./UpdateSetlistForm";
import {
  churchMembersT,
  GroupedMembers,
  setListSongT,
  setListT,
  teamData,
} from "@/utils/types/types";
import { getSongsCompact } from "@/hooks/GET/getSongsCompact";
import { getSetListSongsCompact } from "@/hooks/GET/getSetListSongsCompact";
import { getChurchMembersCompact } from "@/hooks/GET/getChurchMembersCompact";
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";
import { getChurchWorshipTeam } from "@/hooks/GET/getChurchWorshipTeam";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { redirect } from "next/navigation";
import { getSetListTeams } from "@/hooks/GET/getSetListTeams";
import { getChurchTeams } from "@/hooks/GET/getChurchTeams";
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
  console.log("setlistTeams");
  console.log(setlistTeams);

  setlistData.setListSongs = setlistsongs;
  const songs = await getSongsCompact();
  if (hasPermission(userData.role as Role, "update:setlists")) {
    return (
      <div className="container-sub">
        <UpdateSetlistForm
          teams={setlistTeams}
          page="update"
          setlistData={setlistData}
          songsList={songs}
          worshipTeamMembers={worshipTeamMembers}
        />
      </div>
    );
  } else {
    return redirect("/setlist");
  }
}
