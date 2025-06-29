import UpdateSongForm from "./updateSongForm";
import { songSchema } from "@/utils/types/types";
import { getSongById } from "@/hooks/GET/getSongById";

export default async function Page({ params }: { params: { songId: string } }) {
  const songData: songSchema = await getSongById(params.songId);

  return (
    <>
      <div className="container-sub">
        <h1 className="text-2xl font-medium">Aggiorna Canzone</h1>

        <UpdateSongForm songData={songData} type="update" />
      </div>
    </>
  );
}
