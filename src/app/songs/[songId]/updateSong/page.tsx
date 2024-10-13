import { getSong } from "../getSong";
import UpdateSongForm from "./updateSongForm";


export default async function Page({ params }: {params:{songId: string}}) {
    const songData = await getSong(params.songId);

    return (
    <div>
      <UpdateSongForm songData={songData}/>
    </div>
    )
  }