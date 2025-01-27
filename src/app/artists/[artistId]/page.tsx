import { getAlbum } from "./getAlbum";
import { getSongsByArtist } from "./getSongsByArtist";
import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "@/utils/supabase/getUserData";
import { albumT, songType } from "@/utils/types/types";
import AlbumsListComponent from "./albumsListComponent";

export default async function Page({
  params,
}: {
  params: { artistId: string };
}) {
  const albums: albumT[] = await getAlbum(params.artistId);
  const artistsongs: songType[] = await getSongsByArtist(params.artistId);

  const userData: basicUserData = await fbasicUserData();

  if (albums) {
    return (
      <div className="container-sub">
        <AlbumsListComponent albums={albums} songs={artistsongs} />
        
      </div>
    );
  } else {
    return (
      <>
        <h1>No song found</h1>
        <a href="/songs/addSong">Add a New Song!</a>
      </>
    );
  }
}
