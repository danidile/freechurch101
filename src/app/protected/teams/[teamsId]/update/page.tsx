import { getSetList } from "@/hooks/GET/getSetList";
import UpdateSetlistForm from "../../teamsForm";
import { setListSongT, setListT, teamData } from "@/utils/types/types";
import { getSongsCompact } from "@/hooks/GET/getSongsCompact";
import { getSetListSongsCompact } from "@/hooks/GET/getSetListSongsCompact";
import { getChurchTeam } from "@/hooks/GET/getChurchTeam";
import { getChurchMembersCompact } from "@/hooks/GET/getChurchMembersCompact";
import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "@/utils/supabase/getUserData";
export default async function songs({
  params,
}: {
  params: { teamsId: string };
}) {
  const userData: basicUserData = await fbasicUserData();

  const churchTeam: teamData = await getChurchTeam(params.teamsId);
  const churchMembers = await getChurchMembersCompact(userData.church_id);

  return (
    <div className="container-sub">
      <UpdateSetlistForm churchMembers={churchMembers} churchTeam={churchTeam} page="update" />
    </div>
  );
}
