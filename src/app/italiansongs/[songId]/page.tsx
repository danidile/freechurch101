import { getSongById } from "@/hooks/GET/getSongById";
import ChordProViewComponent from "@/app/components/chordProViewComponent";
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";
import { getItalianSongById } from "@/hooks/GET/getGlobalSongById";

export default async function Page({ params }: { params: { songId: string } }) {
  const songData = await getItalianSongById(params.songId);
    const userData: basicUserData = await fbasicUserData();
  
  console.log(songData);
  if (songData) {
    return (
      <div className="container-sub">
        <div className="song-presentation-container">
          <ChordProViewComponent setListSong={songData} />
        </div>
      </div>
    );
  } else {
    console.log("ERRORERRRRRR" + songData);
    return <div className="container-sub">Errore</div>;
  }
}
