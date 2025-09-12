import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "@/utils/supabase/getUserData";
import ItaliansongslistComponent from "@/app/components/italiansongslistComponent";
import { getItalianSongs } from "@/hooks/GET/getGlobalSongs";
import ChurchSongTableComponent from "../songs/ChurchSongTableComponent";

export default async function Page() {
  const italianSongs = await getItalianSongs();
  const userData: basicUserData = await fbasicUserData();
  if (italianSongs) {
    return (
      <div className="container-sub">
        <ChurchSongTableComponent source="italiansongs" songs={italianSongs} />
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
