import { getSong } from "./getSong";
import Song from "./transpose";
import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "@/utils/supabase/getUserData";

export default async function Page({ params }: { params: { songId: string } }) {
  const songData = await getSong(params.songId);
  const userData: basicUserData = await fbasicUserData();

  return (
    <div className="container-sub">
      <Song songData={songData} userData={userData} />
    </div>
  );
}
