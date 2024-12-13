import { getSong } from "../getSong";
import UpdateSongForm from "./updateSongForm";
import { TsongSchema } from "@/utils/types/types";


export default async function Page({ params }: {params:{songId: string}}) {
    const songData: TsongSchema = await getSong(params.songId);

    return (
    <div className="container-sub">
      <UpdateSongForm {...songData}/>
    </div>
    )
  }