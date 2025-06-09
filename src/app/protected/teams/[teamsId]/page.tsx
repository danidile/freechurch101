import { churchMembersT, teamData } from "@/utils/types/types";
import { getChurchTeam } from "@/hooks/GET/getChurchTeam";
import MoreDropdownTeams from "./MoreDropdownTeams";
import { Card, CardBody, CardHeader } from "@heroui/card";

export default async function Page({
  params,
}: {
  params: { teamsId: string };
}) {
  const churchTeam: teamData = await getChurchTeam(params.teamsId);

  if (churchTeam) {
    return (
      <div className="container-sub">
        <Card shadow="none" className="w-full max-w-[500px]">
          <CardHeader className="gap-6 items-center justify-center" >
            <h6>
              <strong>{churchTeam.team_name}</strong>
            </h6>
            <div>
              <MoreDropdownTeams teamsId={params.teamsId} />
            </div>
          </CardHeader>
          <CardBody>
            {churchTeam.team_members.map((member: churchMembersT, index) => {
              return (
                <>
                  <div key={"Song" + index} className="setlist-list">
                    <p>
                      <strong>{member.name + " " + member.lastname}</strong>{" "}
                      <br />
                      {member.roles.join(", ")}
                    </p>
                  </div>
                </>
              );
            })}
          </CardBody>
        </Card>
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
