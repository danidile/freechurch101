import { albumsT, artistsT } from "@/utils/types/types";
import { getArtistsGlobal } from "@/hooks/GET/getArtistsGlobal";
import AddItalianSong from "./addItalianSongComponent";
import { getAlbumsGlobal } from "@/hooks/GET/getAlbumsGlobal";
import UpdateSongForm from "@/app/songs/[songId]/update/updateSongForm";

export default async function Page() {
  const Artists: artistsT[] = await getArtistsGlobal();
  const albums: albumsT[] = await getAlbumsGlobal();

  return (
    <UpdateSongForm
      albums={albums}
      artists={Artists}
      songData={{
        id: "",
        song_title: "",
        author: "",
        artist: "",
        upload_key: "",
        lyrics: "",
        album: "",
        bpm: "",
        tempo: "",
        type: "",
      }}
      type={"add"}
    />
  );
}
