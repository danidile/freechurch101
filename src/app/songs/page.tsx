import { createClient } from "@/utils/supabase/server";
import SongslistComponent from "./songslistComponent";
import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "../../utils/supabase/getUserData";

export default async function Page() {
  const supabase = createClient();
  const { data: songs, error } = await supabase
    .from("songs")
    .select("*")
    .order("song_title", { ascending: true });
  if (error) {
    console.error("Errore durante il fetch:", error);
  }
  const userData: basicUserData = await fbasicUserData();
  if (songs) {
    return (
      <div className="container-sub">
        <SongslistComponent songs={songs} userData={userData} />
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
