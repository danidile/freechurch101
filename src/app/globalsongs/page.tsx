import SongslistComponent from "../components/songslistComponent";
import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "../../utils/supabase/getUserData";
import { getSongs } from "@/hooks/GET/getSongs";
import { sendErrorToSentry } from "@/utils/sentry/SentryErrorDealer";

export default async function Page() {
  const songs = await getSongs();

  const userData: basicUserData = await fbasicUserData();
  const error = { message: "Error" };

  if (songs) {
    return (
      <div className="container-sub">
        <SongslistComponent songs={songs} userData={userData} />
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
