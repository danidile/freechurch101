import { albumsT, artistsT } from "@/utils/types/types";
import { getArtistsGlobal } from "@/hooks/GET/getArtistsGlobal";
import AddGlobalSong from "./addGlobalSongComponent";
import { getAlbumsGlobal } from "@/hooks/GET/getAlbumsGlobal";

export default async function App() {
  const Artists: artistsT[] = await getArtistsGlobal();
  const albums: albumsT[] = await getAlbumsGlobal();

  return <AddGlobalSong albums={albums} artists={Artists} />;
}
