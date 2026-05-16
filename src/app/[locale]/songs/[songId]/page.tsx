import { getSongById } from "@/hooks/GET/getSongById";
import ChordProViewComponentAlt from "@/app/[locale]/components/chordProViewComponentAlt";
import CustomizeWidget from "@/app/[locale]/components/CustomizeWidget";

export default async function Page({ params }: { params: Promise<any> }) {
  const awaitedParams = await params;

  const songData = await getSongById(awaitedParams.songId);

  if (songData) {
    return (
      <div className="container-sub relative">
        <div className="song-presentation-container">
          <ChordProViewComponentAlt source="songs" setListSong={songData} />
        </div>
        <div className="fixed bottom-24 right-4 z-[9999]">
          <CustomizeWidget />
        </div>
      </div>
    );
  } else {
    console.log("ERRORERRRRRR" + songData);
    return <div className="container-sub">Errore</div>;
  }
}
