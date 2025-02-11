import { getSetListSongs } from "@/hooks/GET/getSetListSongs";
import { getSongs } from "@/hooks/GET/getSongs";
import { getSetList } from "@/hooks/GET/getSetList";
import UpdateSetlistForm from "./UpdateSetlistForm";
import { setListSongT } from "@/utils/types/types";
interface TsongNameAuthor {
  id: string;
  author: string;
  song_title: string;
}
export default async function songs({
  params,
}: {
  params: { setListId: string };
}) {
  const setlistData: any = await getSetList(params.setListId);
  let setlistsongs: setListSongT[] = await getSetListSongs(params.setListId);

  const songs = await getSongs();
  
    return (
      <div className="container-sub">
        <UpdateSetlistForm
          setlistData={setlistData}
          setlistsongs={setlistsongs}
          songsList={songs}
        />
      </div>
    );
  
}
