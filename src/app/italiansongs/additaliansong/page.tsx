import { albumsT, artistsT } from "@/utils/types/types";
import { getArtistsGlobal } from "@/hooks/GET/getArtistsGlobal";
import AddItalianSong from "./addItalianSongComponent";
import { getAlbumsGlobal } from "@/hooks/GET/getAlbumsGlobal";
import UpdateSongForm from "@/app/songs/[songId]/update/updateSongForm";
import userDataServer from "@/utils/supabase/getUserDataServer";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";

export default async function Page() {
  const Artists: artistsT[] = await getArtistsGlobal();
  const albums: albumsT[] = await getAlbumsGlobal();
  const userData = await userDataServer();

  if (hasPermission(userData.role as Role, "create:italiansongs")) {
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
  } else {
    return (
      <div className="container-sub">
        <h2>Accesso negato</h2>
      </div>
    );
  }
}
