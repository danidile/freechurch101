import { churchMembersT, teamData } from "@/utils/types/types";
import { getChurchTeam } from "@/hooks/GET/getChurchTeam";
import MoreDropdownTeams from "./MoreDropdownTeams";

export default async function Page({
  params,
}: {
  params: { teamsId: string };
}) {
  const churchTeam: teamData = await getChurchTeam(params.teamsId);
  console.log("churchTeam");
  console.log(churchTeam);

  return (
    <div className="container-sub">
      <div className="song-presentation-container">
        <h6>
          <strong>{churchTeam.team_name}</strong>
        </h6>
        <div className="top-settings-bar">
          <div>
            <MoreDropdownTeams teamsId={params.teamsId} />
          </div>
        </div>

        {churchTeam.team_members.map((member: churchMembersT, index) => {
          console.log("member");
          console.log(member);
          return (
            <>
              <div key={"Song" + index} className="setlist-song">
                <p>
                  <strong>{member.name + " " + member.lastname}</strong> <br />
                  {member.roles.join(", ")}
                </p>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
}
