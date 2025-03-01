import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "@/utils/supabase/getUserData";
import GlobalSongslistComponent from "@/app/components/globalsongslistComponent";
import { getGlobalSongs } from "@/hooks/GET/getGlobalSongs";
import { getArtistsGlobal } from "@/hooks/GET/getArtistsGlobal";

export default async function Page() {
  const globalSongs = await getGlobalSongs();
  const Artists = await getArtistsGlobal();
  const userData: basicUserData = await fbasicUserData();
  if (globalSongs) {
    return (
      <div className="container-sub">
        <GlobalSongslistComponent artists={Artists} songs={globalSongs} userData={userData}  />
      </div>
    );
  } else {
    return (
      <>
        <h1>No songs found</h1>
        <a href="/songs/addSong">Add a New Song!</a>
      </>
    );
  }
}
