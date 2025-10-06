import { getSongById } from "@/hooks/GET/getSongById";
import ChordProViewComponentAlt from "@/app/components/chordProViewComponentAlt";
import CustomizeWidget from "@/app/components/CustomizeWidget";

export default async function Page({ params }: { params: Promise<any> }) {
  const awaitedParams = await params;

  const songData = await getSongById(awaitedParams.songId);

  if (songData) {
    return (
      <div className="container-sub">
        <div className="song-presentation-container">
          <div className="absolute top-[50%] right-0">
            <CustomizeWidget></CustomizeWidget>
          </div>
          <ChordProViewComponentAlt source="songs" setListSong={songData} />
        </div>
      </div>
    );
  } else {
    console.log("ERRORERRRRRR" + songData);
    return <div className="container-sub">Errore</div>;
  }
}
