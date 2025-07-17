import { albumsT, artistsT, songSchema } from "@/utils/types/types";
import { getSongById } from "@/hooks/GET/getSongById";
import { getItalianSongById } from "@/hooks/GET/getItalianSongById";
import { getArtistsGlobal } from "@/hooks/GET/getArtistsGlobal";
import { getAlbumsGlobal } from "@/hooks/GET/getAlbumsGlobal";
import UpdateSongForm from "@/app/songs/[songId]/update/updateSongForm";

export default async function Page({ params }: { params: Promise<any> }) {
  const awaitedParams = await params;

  const songData: songSchema = await getItalianSongById(awaitedParams.songId);
  const Artists: artistsT[] = await getArtistsGlobal();
  const albums: albumsT[] = await getAlbumsGlobal();

  return (
    <UpdateSongForm
      albums={albums}
      artists={Artists}
      songData={songData}
      type={"update"}
    />
  );
}
