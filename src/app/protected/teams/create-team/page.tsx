import { getSongsCompact } from "@/hooks/GET/getSongsCompact";
import TeamsForm from "../teamsForm";
import { getChurchMembersCompact } from "@/hooks/GET/getChurchMembersCompact";
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";

export default async function songs() {
  const songs = await getSongsCompact();
  const setlistData: null = null;
  const userData: basicUserData = await fbasicUserData();
  
  const churchMembers = await getChurchMembersCompact(userData.church_id);
  console.log("churchMembers");
  console.log(churchMembers);
  return (
    <div className="container-sub">
      <TeamsForm page="create" setlistData={setlistData} songsList={songs}  churchMembers={churchMembers}/>

      {/* <CreateSetlistForm songsList={songs} /> */}
    </div>
  );
}
