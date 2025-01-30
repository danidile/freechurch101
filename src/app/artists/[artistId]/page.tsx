import { getAlbum } from "../../../hooks/GET/getAlbum";
import { getSongsByArtist } from "../../../hooks/GET/getSongsByArtist";

import { albumT, songType } from "@/utils/types/types";
import AlbumsListComponent from "./albumsListComponent";

export default async function Page({
  params,
}: {
  params: { artistId: string };
}) {
  const albums: albumT[] = await getAlbum(params.artistId);
  const artistsongs: songType[] = await getSongsByArtist(params.artistId);
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
