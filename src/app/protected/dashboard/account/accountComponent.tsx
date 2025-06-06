"use client";
import LoadingSongsPage from "@/app/songs/loading";
import { getProfileSetList } from "@/hooks/GET/getProfileSetLists";
import { getTeamsByProfile } from "@/hooks/GET/getTeamsByProfile";
import { useUserStore } from "@/store/useUserStore";
import { profileSetlistsT } from "@/utils/types/types";
import { Button, Card, CardBody, CardHeader, Chip, Link } from "@heroui/react";
import { useEffect, useState } from "react";
import { MdEvent } from "react-icons/md";
import { Alert } from "@heroui/alert";

export default function AccountComponent() {
  const { userData, fetchUser, loading } = useUserStore();
  const [setlists, setSetlists] = useState<any[] | null>(null);
  const [teams, setTeams] = useState<any[] | null>(null);
  const [loadingSongs, setLoadingSongs] = useState(true);

  // Step 1: Make sure user is fetched on first mount
  useEffect(() => {
    if (!userData.loggedIn) {
      fetchUser();
    }
  }, []);

  // Step 2: Once user is available, fetch songs
  useEffect(() => {
    if (!loading && userData.loggedIn) {
      getProfileSetList(userData.id).then((fetchedProfileSetLists) => {
        setSetlists(fetchedProfileSetLists);
        setLoadingSongs(false);
      });
      getTeamsByProfile(userData.id).then((fetchedTeams) => {
        setTeams(fetchedTeams);
        setLoadingSongs(false);
      });
    }
  }, [loading, userData]);

  if (loading || loadingSongs || !userData.loggedIn)
    return <LoadingSongsPage />;
  const currentDate = new Date();
  const nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() - 1);

  return (
    <div>
      {userData.name && (
        <>
          <h5>
            Benvenuto {userData?.name + " "}
            {userData.lastname && userData.lastname}
          </h5>
          <small>{userData?.email}</small>
          <Link href="/protected/dashboard/account/completeAccount">
            Aggiorna profilo
          </Link>
        </>
      )}
      {(!userData.name || !userData.lastname) && (
        <div className="flex flex-col gap-1 items-center">
          <div className="flex items-center justify-center w-full">
            <Alert
              description="Clicca su 'Aggiorna profilo' per completare il tuo account e avere accesso a maggiori funzionalità. "
              title="Profilo incompleto"
              color="danger"
            />
          </div>

          <Link href="/protected/dashboard/account/completeAccount">
            Aggiorna profilo
          </Link>
        </div>
      )}
      {userData.pending_church_confirmation && (
        <Alert
        className="my-5"
          color="primary"
          description="Attendi che i responsabili della tua chiesa confermino il tuo account."
          title="In attesa di conferma"
        />
      )}
      {/* <ModalRoleUpdate
        peopleId={userData.id}
        profile={userData}
        userData={userData}
      /> */}

      {teams && teams.length >= 1 && (
        <div className="">
          Team di {userData.name}
          {teams.map((team) => {
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
      {setlists && setlists.length >= 1 && (
        <div>
          <Card shadow="none" className="max-w-full my-4 w-96 border-none">
            <CardHeader className="flex gap-3 border-b-2 border-gray-800">
              {" "}
              <MdEvent size={25} />
              <h6>Prossimi eventi </h6>
            </CardHeader>
            <CardBody>
              {setlists.map((setlist: profileSetlistsT) => {
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
