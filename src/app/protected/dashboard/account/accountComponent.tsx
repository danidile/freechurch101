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
  Spinner,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { MdEvent } from "react-icons/md";
import { Alert } from "@heroui/alert";
import { getPendingChurchMembershipRequests } from "@/hooks/GET/getPendingChurchMembershipRequests";
import { FaExternalLinkAlt } from "react-icons/fa";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { useChurchStore } from "@/store/useChurchStore";
import { FaLink } from "react-icons/fa6";
import { FiPlus } from "react-icons/fi";
import Link from "next/link";

export default function AccountComponent() {
  const { userData, loading } = useUserStore();
  const { churchMembers, loadingChurchData } = useChurchStore();
  const [setlists, setSetlists] = useState<any[] | null>([]);
  const [teams, setTeams] = useState<any[] | null>([]);
  const [pendingRequests, setPendingRequests] = useState(false);
  const [fetchedData, setFetchedData] = useState(false);
  const { eventTypes } = useChurchStore();

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

        if (hasPermission(userData.role as Role, "confirm:churchMembership")) {
          const pendingChurchMembershipRequests =
            await getPendingChurchMembershipRequests(userData.church_id);
          console.log(
            "pendingChurchMembershipRequests",
            pendingChurchMembershipRequests
          );
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
  const upcomingSetlists = setlists?.filter(
    (setlist: profileSetlistsT) => new Date(setlist.date) > currentDate
  );

  return (
    <div className=" w-full">
      <div className="p-0 sm:p-12">
        <h4>
          Benvenuto {userData?.name + " "}
          {userData.lastname && userData.lastname}
        </h4>
        <p>{userData?.email}</p>
        <div className=" ncard">
          {teams && teams.length >= 1 && (
            <div className=" w-full">
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
          <div className=" grid w-full gap-4 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))] sm:[grid-template-columns:repeat(auto-fit,minmax(350px,1fr))]">
            <div className="nborder ncard flex flex-col flex-wrap gap-4 w-full ">
              <div className="flex flex-row justify-start items-center gap-3">
                <FaLink size={25} />
                <h5>Link veloci</h5>
              </div>{" "}
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
              {hasPermission(userData.role as Role, "read:churchmembers") && (
                <>
                  {churchMembers?.length <= 5 && (
                    <div className="inline-flex flex-wrap flex-row gap-5 items-center justify-between n-card nborder p-4 !border-blue-300 border-1">
                      <p>Invita nuovi membri nella tua chiesa!</p>
                      <Button
                        color="primary"
                        as={Link}
                        href="/protected/church/invitemembers"
                      >
                        {" "}
                        Invita nuovi membri!
                      </Button>
                    </div>
                  )}
                </>
              )}
              <div className="inline-flex flex-wrap flex-row gap-5 items-center justify-between n-card nborder p-4 !border-red-200 border-1">
                <p>Blocca le date in cui non sei disponibile.</p>
                <Button
                  className="bg-[#ea685c] text-white"
                  as={Link}
                  href="/protected/blockouts"
                >
                  Blocca Date
                </Button>
              </div>
            </div>
            <div className="nborder ncard flex flex-col flex-wrap gap-4 w-full !border-slate-300 border-1 ">
              <div className="flex flex-row justify-start items-center gap-3">
                <MdEvent size={25} />
                <h5>Prossimi eventi</h5>
              </div>

              {upcomingSetlists && upcomingSetlists.length > 0 && (
                <>
                  {upcomingSetlists.map((setlist: profileSetlistsT) => {
                    const date = new Date(setlist.date);
                    const readableDate = date.toLocaleString("it-IT", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });
                    const matched = eventTypes?.find(
                      (event) => event.key === setlist.event_type
                    );
                    return (
                      <div
                        key={setlist.id}
                        className="border-1 rounded-lg border-slate-300 my-1 !max-w-full p-3"
                      >
                        <div className="flex gap-3 relative">
                          <div className="flex flex-col w-full max-w-full">
                            <div className="flex justify-between max-w-full">
                              <p className="text-md">
                                {matched?.alt ||
                                  matched?.label ||
                                  "Evento sconosciuto"}
                              </p>
                              <>
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
                          <Link href={`/setlist/${setlist.setlist_id}`}>
                            Pagina evento
                          </Link>
                        </div>
                      </div>
                    );
                  })}{" "}
                </>
              )}
              {upcomingSetlists && upcomingSetlists.length == 0 && (
                <>
                  <small>Nessun evento in programma.</small>
                  <div className="w-full flex flex-row justify-start">
                    {hasPermission(
                      userData.role as Role,
                      "create:setlists"
                    ) && (
                      <Link
                        href="/setlist/addSetlist"
                        className="button-style flex items-center gap-2 ml-0"
                      >
                        Nuovo Evento
                        <FiPlus />
                      </Link>
                    )}
                    {!hasPermission(
                      userData.role as Role,
                      "create:setlists"
                    ) && (
                      <>
                        <small>
                          Attenti che i leader della tua chiesa creino i
                          prossimi eventi
                        </small>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
