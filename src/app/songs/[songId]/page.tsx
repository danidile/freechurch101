import { getSongById } from "@/hooks/GET/getSongById";
import Song from "./transpose";
import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "@/utils/supabase/getUserData";

export default async function Page({ params }: { params: { songId: string } }) {
  const songData = await getSongById(params.songId);
  const userData: basicUserData = await fbasicUserData();
console.log(songData);
  if(songData){
  return (
    <div className="container-sub">
      <Song songData={songData} userData={userData} />
    </div>
  );
}else{
  console.log("ERRORERRRRRR"+songData);
  return (
    <div className="container-sub">
      Errore
    </div>)
}
}
