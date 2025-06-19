"use client";
import { getProfileById } from "@/hooks/GET/getProfileById";
import { getProfileSetList } from "@/hooks/GET/getProfileSetLists";
import { getTeamsByProfile } from "@/hooks/GET/getTeamsByProfile";
import fbasicUserData from "@/utils/supabase/getUserData";
import { profileSetlistsT, profileT, profileTeamsT } from "@/utils/types/types";
import { basicUserData } from "@/utils/types/userData";
import { Card, CardBody, CardHeader, Chip, Link, Spinner } from "@heroui/react";
import { MdEvent } from "react-icons/md";

import ModalRoleUpdate from "./modalRoleUpdate";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import ChurchLabLoader from "@/app/components/churchLabSpinner";

export default function PeopleIdComponent({
  params,
}: {
  params: { peopleId: string };
}) {
  const { userData, loading } = useUserStore();
  const [profile, setProfile] = useState<profileT | null>();
  const [profileSetlist, setProfileSetlist] = useState<
    profileSetlistsT[] | null
  >([]);
  const [profileTeams, setProfileTeams] = useState<profileTeamsT[] | null>([]);
  const [loadingSongs, setLoadingSongs] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      const fetchedProfile = await getProfileById(params.peopleId);
      setProfile(fetchedProfile);
      const fetchedSetlists = await getProfileSetList(params.peopleId);
      setProfileSetlist(fetchedSetlists);
      const fetchedTeams = await getTeamsByProfile(params.peopleId);
      setProfileTeams(fetchedTeams);
      setLoadingSongs(false);
    };
    fetchSongs();
  }, [userData?.loggedIn]);

  if (loading || loadingSongs) return <ChurchLabLoader />;

  const currentDate = new Date();
  const nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() - 1);

  if (!hasPermission(userData.role as Role, "read:churchmembers"))
    return (
      <div className="container-sub ">
        <div className="max-w-[600px] h-[70vh] flex flex-col justify-center items-center text-center">
          <h3> Accesso negato.</h3>
          <p>
            Per motivi di privacy solo gli amministratori della chiesa e i
            responsabili di team possono visualizzare questa pagina.
          </p>
        </div>
      </div>
    );
  return (
    <div className="container-sub">
      <h5>{profile.name + " " + profile.lastname}</h5>
      <p>{profile.email}</p>
      <ModalRoleUpdate
        peopleId={params.peopleId}
        profile={profile}
        userData={userData}
      />

      {profileTeams.length >= 1 && (
        <div className="">
          Team di {profile.name}
          {profileTeams.map((team, index) => {
            return (
              <div className="flex gap-1" key={index}>
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
          <Card shadow="none" className="max-w-full my-4 w-96 border-none">
            <CardHeader className="flex gap-3 border-b-2 border-gray-800">
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
                    <div className="border-1 rounded-lg border-slate-300 my-1  !max-w-full p-3">
                      <div className="flex gap-3 relative">
                        <div className="flex flex-col w-full max-w-full">
                          <div
                            className="flex  max-w-full
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
