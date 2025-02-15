import { getSetList } from "@/hooks/GET/getSetList";
import UpdateSetlistForm from "../../teamsForm";
import { setListSongT, setListT } from "@/utils/types/types";
import { getSongsCompact } from "@/hooks/GET/getSongsCompact";
import { getSetListSongsCompact } from "@/hooks/GET/getSetListSongsCompact";
export default async function songs({
  params,
}: {
  params: { setListId: string };
}) {
  let setlistData: setListT = await getSetList(params.setListId);
  let setlistsongs: setListSongT[] = await getSetListSongsCompact(
    params.setListId
  );
  setlistData.setListSongs = setlistsongs;
  const songs = await getSongsCompact();
  return (
    <div className="container-sub">
      <UpdateSetlistForm
        churchMembers={null}
        page="update"
        setlistData={setlistData}
        songsList={songs}
      />
    </div>
  );
}
