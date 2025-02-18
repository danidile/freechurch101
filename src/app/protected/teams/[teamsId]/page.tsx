import { churchMembersT, teamData } from "@/utils/types/types";
import { getChurchTeam } from "@/hooks/GET/getChurchTeam";
import MoreDropdownTeams from "./MoreDropdownTeams";
import GetParamsMessage from "@/app/components/getParams";

export default async function Page({
  params,
}: {
  params: { teamsId: string };
}) {
  const churchTeam: teamData = await getChurchTeam(params.teamsId);

  if (churchTeam) {
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
            
            return (
              <>
                <div key={"Song" + index} className="setlist-song">
                  <p>
                    <strong>{member.name + " " + member.lastname}</strong>{" "}
                    <br />
                    {member.roles.join(", ")}
                  </p>
                </div>
              </>
            );
          })}
        </div>
        <GetParamsMessage />
      </div>
    );
  } else {
    return (
      <div className="container-sub">
        <div className="song-presentation-container">
          <h6>
            <strong>Nessun Team trovato</strong>
          </h6>
        </div>
      </div>
    );
  }
}
