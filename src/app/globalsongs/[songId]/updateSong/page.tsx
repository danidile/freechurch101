import { basicUserData } from "@/utils/types/userData";
import UpdateSongForm from "./updateSongForm";
import { songSchema } from "@/utils/types/types";
import fbasicUserData from "@/utils/supabase/getUserData";
import { getSongById } from "@/hooks/GET/getSongById";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";

export default async function Page({ params }: { params: { songId: string } }) {
  const songData: songSchema = await getSongById(params.songId);
  const userData: basicUserData = await fbasicUserData();

  return (
    <>
      {hasPermission(userData.role as Role, "create:songs") && (
        <div className="container-sub">
          <UpdateSongForm {...songData} />
        </div>
      )}
    </>
  );
}
