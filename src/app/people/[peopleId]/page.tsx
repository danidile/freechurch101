import { getProfileById } from "@/hooks/GET/getProfileById";
import { getProfileSetList } from "@/hooks/GET/getProfileSetLists";
import { getSetListTeams } from "@/hooks/GET/getSetListTeams";
import { getTeamsByProfile } from "@/hooks/GET/getTeamsByProfile";
import {
  GroupedMembers,
  profileSetlistsT,
  profileT,
  profileTeamsT,
} from "@/utils/types/types";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Link,
} from "@heroui/react";
import { FaCircle, FaCheck } from "react-icons/fa";
import { MdEvent } from "react-icons/md";
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
  const profileSetlist: profileSetlistsT[] = await getProfileSetList(
    params.peopleId
  );

  const profileTeams: profileTeamsT[] = await getTeamsByProfile(
    params.peopleId
  );
  const currentDate = new Date();
  const nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() - 1);
  console.log("profileSetlist");
  console.log(profileSetlist);
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
                {team.roles.length >= 1 && (
                  <p className="italic">{" (" + team.roles.join(", ") + ")"}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {profileSetlist.length >= 1 && (
        <div>
          <Card className="max-w-[400px] my-4">
            <CardHeader className="flex gap-3 border-b-2 border-gray-800">
              {" "}
              <MdEvent size={25} />
              <h6>Prossimi eventi </h6>
            </CardHeader>
            <CardBody>
              {profileSetlist.map((setlist: profileSetlistsT) => {
                const date = new Date(setlist.date);
                const readableDate = date.toLocaleString("it-IT", {
                  weekday: "long", // "Sunday"
                  year: "numeric", // "2024"
                  month: "long", // "November"
                  day: "numeric", // "10"
                });
                if (date > currentDate) {
                  return (
                    <div className="border-b-1 border-slate-400 my-1 p-2">
                      <div className="flex gap-3 border-b-1 border-gray-300">
                        <div className="flex items-center justify-center h-10 w-10">
                          {setlist.status === "pending" && (
                            <FaCircle color="orange" size={10} />
                          )}
                          {setlist.status === "confirmed" && (
                            <FaCheck color="green" size={10} />
                          )}
                          {setlist.status === "denied" && (
                            <FaCircle color="red" size={10} />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <p className="text-md">{setlist.event_title}</p>
                          <p className="text-small text-default-500 capitalize">
                            {readableDate}
                          </p>
                        </div>
                      </div>

                      <p>
                        <span className="capitalize">{readableDate}</span> sei
                        di turno con il {setlist.team_name}.
                      </p>
                      <Link
                        isExternal
                        showAnchorIcon
                        href="https://github.com/heroui-inc/heroui"
                      >
                        Pagina evento
                      </Link>
                    </div>
                  );
                }
              })}{" "}
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
