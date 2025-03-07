import UpdateSetlistForm from "../../teamsForm";
import { profileT, teamData } from "@/utils/types/types";

import { getChurchTeam } from "@/hooks/GET/getChurchTeam";
import { getChurchMembersCompact } from "@/hooks/GET/getChurchMembersCompact";
import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "@/utils/supabase/getUserData";
import TeamsForm from "../../teamsForm";
import { getProfilesByChurch } from "@/hooks/GET/getProfilesByChurch";
export default async function songs({
  params,
}: {
  params: { teamsId: string };
}) {
  const userData: basicUserData = await fbasicUserData();

  const churchTeam: teamData = await getChurchTeam(params.teamsId);
  const churchMembers: profileT[] = await getProfilesByChurch(
    userData.church_id
  );

  return (
    <div className="container-sub">
      <TeamsForm
        page="update"
        churchTeam={churchTeam}
        churchMembers={churchMembers}
      />
    </div>
  );
}
