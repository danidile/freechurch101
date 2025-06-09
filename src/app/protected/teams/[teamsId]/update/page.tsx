import UpdateSetlistForm from "../../teamsForm";
import { profileT, teamData } from "@/utils/types/types";

import { getChurchTeam } from "@/hooks/GET/getChurchTeam";
import { getChurchMembersCompact } from "@/hooks/GET/getChurchMembersCompact";
import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "@/utils/supabase/getUserData";
import TeamsForm from "../../teamsForm";
import { getProfilesByChurch } from "@/hooks/GET/getProfilesByChurch";
import UpdateTeamForm from "./updateTeamForm";
export default async function songs({
  params,
}: {
  params: { teamsId: string };
}) {
  return (
    <div className="container-sub">
      <UpdateTeamForm params={params} />
    </div>
  );
}
