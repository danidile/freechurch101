import { getAlbum } from "../../../hooks/GET/getAlbum";
import { getSongsByArtist } from "../../../hooks/GET/getSongsByArtist";

import { albumT, GroupedSongsByAlbum, songType } from "@/utils/types/types";
import AlbumsListComponent from "./albumsListComponent";

export default async function Page({
  params,
}: {
  params: { artistId: string };
}) {
  const songsByAlbum: GroupedSongsByAlbum = await getAlbum(params.artistId);
  if (songsByAlbum) {
    return (
      <div className="container-sub">
        <AlbumsListComponent songsByAlbum={songsByAlbum} />
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
