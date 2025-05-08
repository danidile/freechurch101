import { getProfileById } from "@/hooks/GET/getProfileById";
import { getProfileSetList } from "@/hooks/GET/getProfileSetLists";
import { getTeamsByProfile } from "@/hooks/GET/getTeamsByProfile";
import { profileSetlistsT, profileT, profileTeamsT } from "@/utils/types/types";
import { Card, CardBody, CardHeader, Chip, Link } from "@heroui/react";
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
          <Card shadow="none" className="max-w-full my-4 border-none">
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
                    <div className="border-1 rounded-lg border-slate-300 my-1 w-96 p-3">
                      <div className="flex gap-3 relative">
                        <div className="flex flex-col w-full max-w-full">
                          <div
                            className="flex w-full max-w-full
                          justify-between"
                          >
                            <p className="text-md">{setlist.event_title}</p>
                            <>
                              {" "}
                              {setlist.status === "pending" && (
                                <Chip variant="flat" color="warning">
                                  In Attesa
                                </Chip>
                              )}
                              {setlist.status === "confirmed" && (
                                <Chip variant="flat" color="success">
                                  Confermato
                                </Chip>
                              )}
                              {setlist.status === "denied" && (
                                <Chip variant="flat" color="danger">
                                  Rifiutato
                                </Chip>
                              )}
                            </>
                          </div>

                          <p className="text-small text-default-500 capitalize">
                            {readableDate}
                          </p>
                        </div>
                      </div>

                      <p className="text-small text-default-800 capitalize">
                        Team: {setlist.team_name}.
                      </p>
                      <div className="flex justify-end">
                        <Link
                          showAnchorIcon
                          href={`/setlist/${setlist.setlist_id}`}
                        >
                          Pagina evento
                        </Link>
                      </div>
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
