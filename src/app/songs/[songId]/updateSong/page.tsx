import { basicUserData } from "@/utils/types/userData";
import { getSong } from "../getSong";
import UpdateSongForm from "./updateSongForm";
import { TsongSchema } from "@/utils/types/types";
import fbasicUserData from "@/utils/supabase/getUserData";
import { redirect } from "next/navigation";


export default async function Page({ params }: {params:{songId: string}}) {
    const songData: TsongSchema = await getSong(params.songId);
      const userData: basicUserData = await fbasicUserData();
    
    if(userData.role == "1" || userData.role == "2"){
    return (
    <div className="container-sub">
      <UpdateSongForm {...songData}/>
    </div>
    )
  }else{
    return redirect("/songs");
  }
  }