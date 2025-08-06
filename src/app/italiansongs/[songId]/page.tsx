import ChordProViewComponent from "@/app/components/chordProViewComponent";
import { getItalianSongById } from "@/hooks/GET/getGlobalSongById";

export default async function Page({ params }: { params: Promise<any> }) {
  const awaitedParams = await params;
  const songData = await getItalianSongById(awaitedParams.songId);

  if (songData) {
    return (
      <div className="container-sub">
        <div className="song-presentation-container">
          <ChordProViewComponent setListSong={songData}   />
        </div>
      </div>
    );
  } else {
    console.log("ERRORERRRRRR" + songData);
    return <div className="container-sub">Errore</div>;
  }
}
