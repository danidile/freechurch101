import { getSongsCompact } from "@/hooks/GET/getSongsCompact";
import UpdateSetlistForm from "../[setListId]/update/UpdateSetlistForm";
import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "@/utils/supabase/getUserData";
import { getChurchWorshipTeam } from "@/hooks/GET/getChurchWorshipTeam";
import { churchMembersT, teamData } from "@/utils/types/types";
import { getChurchTeams } from "@/hooks/GET/getChurchTeams";

export default async function songs() {
  const songs = await getSongsCompact();
  const setlistData: null = null;
  const userData: basicUserData = await fbasicUserData();
  const worshipTeamMembers: churchMembersT[] = await getChurchWorshipTeam(
    userData.church_id
  );
  const teams: teamData[] = await getChurchTeams(userData.church_id);

  return (
    <div className="container-sub">
      <UpdateSetlistForm
        teams={teams}
        worshipTeamMembers={worshipTeamMembers}
        page="create"
        setlistData={setlistData}
        songsList={songs}
      />
    </div>
  );
}
