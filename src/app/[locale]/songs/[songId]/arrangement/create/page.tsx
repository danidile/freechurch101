import { getSongById } from "@/hooks/GET/getSongById";
import CustomizeWidget from "@/app/[locale]/components/CustomizeWidget";
import ArrangementCreator from "@/app/[locale]/components/arrangementCreator";

export default async function Page({ params }: { params: Promise<any> }) {
  const awaitedParams = await params;

  const songData = await getSongById(awaitedParams.songId);

  if (songData) {
    return (
      <div className="container-sub">
        <CustomizeWidget />

        <div className="song-presentation-container">
          <ArrangementCreator setListSong={songData} />
        </div>
      </div>
    );
  } else {
    console.log("ERRORERRRRRR" + songData);
    return <div className="container-sub">Errore</div>;
  }
}
