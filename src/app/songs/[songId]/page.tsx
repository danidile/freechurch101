import { getSongById } from "@/hooks/GET/getSongById";
import Song from "./transpose";
import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "@/utils/supabase/getUserData";
import SongslistComponent from "@/app/components/songslistComponent";
import ChordProViewComponent from "@/app/components/chordProViewComponent";

export default async function Page({ params }: { params: { songId: string } }) {
  const songData = await getSongById(params.songId);
  console.log(songData);
  if (songData) {
    return (
      <div className="container-sub">
        <div className="song-presentation-container">
        <ChordProViewComponent setListSong={songData} />
        </div></div>
    );
  } else {
    console.log("ERRORERRRRRR" + songData);
    return <div className="container-sub">Errore</div>;
  }
}
