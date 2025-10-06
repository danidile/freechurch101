import { getSetList } from "@/hooks/GET/getSetList";
import { getSetListSongs } from "@/hooks/GET/getSetListSongs";
import { setListT, setListSongT, GroupedMembers } from "@/utils/types/types";
import ViewFullSetListComponent from "../viewFullSetListComponent";
import CustomizeWidget from "@/app/components/CustomizeWidget";

export default async function Page({ params }: { params: Promise<any> }) {
  const awaitedParams = await params;

  const setlistData: setListT = await getSetList(awaitedParams.setListId);
  let setlistsongs: setListSongT[] = await getSetListSongs(
    awaitedParams.setListId
  );
  return (
    <div className="container-sub">
      
      <ViewFullSetListComponent
        setlistData={setlistData}
        setlistsongs={setlistsongs}
      />
    </div>
  );
}
