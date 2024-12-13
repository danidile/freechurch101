import { getSong } from "./getSong";
import Song from "./transpose";


export default async function Page({ params }: {params:{songId: string}}) {
    const songData = await getSong(params.songId);
  
    return (
    <div>
      
      <Song songData={songData} />


    </div>
    )
  }