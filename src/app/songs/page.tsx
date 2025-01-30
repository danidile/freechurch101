import { createClient } from "@/utils/supabase/server";
import SongslistComponent from "./songslistComponent";
import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "../../utils/supabase/getUserData";
import { getSongs } from "@/hooks/GET/getSongs";

export default async function Page() {
  const songs = await getSongs();


  
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
