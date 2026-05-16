import UpdateSongForm from "./updateSongForm";
import { songSchema } from "@/utils/types/types";
import { getSongById } from "@/hooks/GET/getSongById";

export default async function Page({ params }: { params: Promise<any> }) {
  const awaitedParams = await params;

  const songData: songSchema = await getSongById(awaitedParams.songId);

  return (
    <>
      <div className="container-sub">
        <h1 className="text-2xl font-medium">Aggiorna Canzone</h1>

        <UpdateSongForm songData={songData} type="update" />
      </div>
    </>
  );
}
