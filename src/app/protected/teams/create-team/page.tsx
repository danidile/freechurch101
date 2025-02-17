import TeamsForm from "../teamsForm";
import { getChurchMembersCompact } from "@/hooks/GET/getChurchMembersCompact";
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";

export default async function songs() {
  const userData: basicUserData = await fbasicUserData();
  const churchMembers = await getChurchMembersCompact(userData.church_id);
  console.log("churchMembers");
  console.log(churchMembers);
  return (
    <div className="container-sub">
      <TeamsForm
        page="create"
        churchTeam={null}
        churchMembers={churchMembers}
      />
    </div>
  );
}
