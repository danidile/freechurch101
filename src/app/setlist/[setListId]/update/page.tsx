import { getSetListSongs } from "@/hooks/GET/getSetListSongs";
import { getSongs } from "@/hooks/GET/getSongs";
import { getSetList } from "@/hooks/GET/getSetList";
import UpdateSetlistForm from "./UpdateSetlistForm";
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
  let setlistsongs = await getSetListSongs(params.setListId);
  const songs = await getSongs();
  if (songs) {
    const newSongList: TsongNameAuthor[] = [];
    let newSong: TsongNameAuthor = { id: "", author: "", song_title: "" };
    for (let i = 0; i < songs.length; i++) {
      newSong = {
        id: songs[i].id,
        author: songs[i].author,
        song_title: songs[i].song_title,
      };
      newSongList.unshift(newSong);
    }
    return (
      <div className="container-sub">
        <UpdateSetlistForm setlistData={setlistData} setlistsongs={setlistsongs} songsList={newSongList} />
      </div>
    );
  }
}
