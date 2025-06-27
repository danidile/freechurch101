"use client";
import LoadingSongsPage from "@/app/songs/loading";
import { getProfileSetList } from "@/hooks/GET/getProfileSetLists";
import { getTeamsByProfile } from "@/hooks/GET/getTeamsByProfile";
import { useUserStore } from "@/store/useUserStore";
import { profileSetlistsT } from "@/utils/types/types";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Link,
  Spinner,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { MdEvent } from "react-icons/md";
import { Alert } from "@heroui/alert";
import { getPendingChurchMembershipRequests } from "@/hooks/GET/getPendingChurchMembershipRequests";
import { FaExternalLinkAlt } from "react-icons/fa";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";

export default function AccountComponent() {
  const { userData, loading } = useUserStore();
  const [setlists, setSetlists] = useState<any[] | null>([]);
  const [teams, setTeams] = useState<any[] | null>([]);
  const [pendingRequests, setPendingRequests] = useState(false);
  const [fetchedData, setFetchedData] = useState(false);

  useEffect(() => {
    console.log(loading);
    const fetchData = async () => {
      if (!loading && userData) {
        const [fetchedProfileSetLists, fetchedTeams] = await Promise.all([
          getProfileSetList(userData.id),
          getTeamsByProfile(userData.id),
        ]);
        setSetlists(fetchedProfileSetLists);
        setTeams(fetchedTeams);
        setFetchedData(true);

        if (hasPermission(userData.role as Role, "update:songs")) {
          const pendingChurchMembershipRequests =
            await getPendingChurchMembershipRequests(userData.church_id);
          if (
            pendingChurchMembershipRequests &&
            pendingChurchMembershipRequests.length >= 1
          )
            setPendingRequests(true);
        }
      }
    };

    fetchData();
  }, [userData, loading]);

  if (loading || !userData)
    return (
      <div className="container-sub">
        <Spinner size="lg" />
      </div>
    );
  const currentDate = new Date();
  const nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() - 1);

  return (
    <div className=" w-full">
      <div className="p-2 sm:p-12">
        <h4>
          Benvenuto {userData?.name + " "}
          {userData.lastname && userData.lastname}
        </h4>
        <p>{userData?.email}</p>
        <div className="nborder ncard ">
          {userData.pending_church_confirmation && (
            <Alert
              className="my-5"
              color="primary"
              description="Attendi che i responsabili della tua chiesa confermino il tuo account."
              title="In attesa di conferma"
            />
          )}
          {pendingRequests && (
            <Link
              className="dashboard-list !p-0"
              href="/protected/church/confirm-members"
            >
              <Alert
                endContent={<FaExternalLinkAlt />}
                color="warning"
                description="Alcuni account sono in attesa della tua conferma."
                title="In attesa di conferma"
              />
            </Link>
          )}
          {teams && teams.length >= 1 && (
            <div className="">
              Team di {userData.name}
              {teams.map((team) => {
                return (
                  <div key={team.id} className="flex gap-1">
                    <p className="font-bold">{team.team_name}</p>
                    {team.roles && team.roles.length >= 1 && (
                      <p className="italic">
                        {" (" + team.roles.join(", ") + ")"}
                      </p>
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
                        <div
                          key={setlist.id}
                          className="border-1 rounded-lg border-slate-300 my-1  !max-w-full p-3"
                        >
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
      </div>
    </div>
  );
}
