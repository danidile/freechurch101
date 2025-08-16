import { getSongById } from "@/hooks/GET/getSongById";
import ChordProViewComponentAlt from "@/app/components/chordProViewComponentAlt";
import CustomizeWidget from "@/app/components/CustomizeWidget";

export default async function Page({ params }: { params: Promise<any> }) {
  const awaitedParams = await params;

  const songData = await getSongById(awaitedParams.songId);

  if (songData) {
    return (
      <div className="container-sub">
        <CustomizeWidget />

        <div className="song-presentation-container">
          <ChordProViewComponentAlt
            source="songs"
            setListSong={songData}
          />
        </div>
      </div>
    );
  } else {
    console.log("ERRORERRRRRR" + songData);
    return <div className="container-sub">Errore</div>;
  }
}
