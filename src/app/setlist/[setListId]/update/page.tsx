import { getSetList } from "@/hooks/GET/getSetList";
import UpdateSetlistForm from "./UpdateSetlistForm";
import { setListSongT, setListT } from "@/utils/types/types";
import { getSongsCompact } from "@/hooks/GET/getSongsCompact";
import { getSetListSongsCompact } from "@/hooks/GET/getSetListSongsCompact";
import { getChurchMembersCompact } from "@/hooks/GET/getChurchMembersCompact";
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";
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
  const churchMembers = await getChurchMembersCompact(userData.church_id);

  setlistData.setListSongs = setlistsongs;
  const songs = await getSongsCompact();
  return (
    <div className="container-sub">
      <UpdateSetlistForm
        page="update"
        setlistData={setlistData}
        songsList={songs}
        worshipTeamMembers={churchMembers}
      />
    </div>
  );
}
