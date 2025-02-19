import TeamsForm from "../teamsForm";
import { getChurchMembersCompact } from "@/hooks/GET/getChurchMembersCompact";
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";
import { redirect } from "next/navigation";

export default async function songs() {
  const userData: basicUserData = await fbasicUserData();
  const churchMembers = await getChurchMembersCompact(userData.church_id);
  console.log("churchMembers");
  console.log(churchMembers);
  if (Number(userData.role) <= 2) {
    return (
      <div className="container-sub">
        <TeamsForm
          page="create"
          churchTeam={null}
          churchMembers={churchMembers}
        />
      </div>
    );
  }else{
    redirect("/protected/teams");
  }
}
