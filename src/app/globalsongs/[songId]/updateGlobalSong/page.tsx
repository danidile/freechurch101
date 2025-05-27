import { basicUserData } from "@/utils/types/userData";
import UpdateSongForm from "./updateSongForm";
import { songSchema } from "@/utils/types/types";
import fbasicUserData from "@/utils/supabase/getUserData";
import { redirect } from "next/navigation";
import { getSongById } from "@/hooks/GET/getSongById";

export default async function Page({ params }: { params: { songId: string } }) {
  const songData: songSchema = await getSongById(params.songId);
  const userData: basicUserData = await fbasicUserData();

  if (userData.role == "1" || userData.role == "2") {
    return (
      <div className="container-sub">
        <UpdateSongForm {...songData} />
      </div>
    );
  } else {
    return redirect("/songs");
  }
}
