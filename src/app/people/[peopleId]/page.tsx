import { getProfileById } from "@/hooks/GET/getProfileById";
import { getSetListTeams } from "@/hooks/GET/getSetListTeams";
import { getTeamsByProfile } from "@/hooks/GET/getTeamsByProfile";
import { GroupedMembers, profileT, profileTeamsT } from "@/utils/types/types";
import { Chip } from "@heroui/react";
const roles = [
  "Admin",
  "Fondatore Chiesa",
  "Admin Chiesa",
  "Team Leader",
  "4",
  "5",
  "6",
  "7",
  "Membro Chiesa",
  "Utente senza Chiesa",
];
export default async function Page({
  params,
}: {
  params: { peopleId: string };
}) {
  const profile: profileT = await getProfileById(params.peopleId);
    let setlistTeams: GroupedMembers = await getSetListTeams(params.peopleId);
  
  const profileTeams: profileTeamsT[] = await getTeamsByProfile(
    params.peopleId
  );

  return (
    <div className="container-sub">
      <h5>{profile.name + " " + profile.lastname}</h5>
      <p>{profile.email}</p>
      <Chip radius="sm" color="primary" variant="flat" className="my-3">
        {roles[Number(profile.role)]}
      </Chip>
      {profileTeams.length >= 1 && (
        <div className="">
          Team di {profile.name}
          {profileTeams.map((team) => {
            return (
              <div className="flex gap-1">
                <p className="font-bold">{team.team_name}</p>
                {team.roles.length >= 1 && <p className="italic">{" (" + team.roles.join(", ") + ")"}</p>}
              </div>
            );
          })}
        </div>
      )}
      <div>
        <h6>Prossimi eventi </h6>
      </div>
    </div>
  );
}
