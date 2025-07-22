"use client";
import LoadingSongsPage from "@/app/songs/loading";
import { getProfileSetList } from "@/hooks/GET/getProfileSetLists";
import { getTeamsByProfile } from "@/hooks/GET/getTeamsByProfile";
import { useUserStore } from "@/store/useUserStore";
import { ChipColor, profileSetlistsT } from "@/utils/types/types";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spinner,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { MdEvent } from "react-icons/md";
import { Alert } from "@heroui/alert";
import { getPendingChurchMembershipRequests } from "@/hooks/GET/getPendingChurchMembershipRequests";
import { FaExternalLinkAlt, FaPlus, FaRegCheckCircle, FaRegClock } from "react-icons/fa";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { useChurchStore } from "@/store/useChurchStore";
import { FaLink, FaRegCircleXmark } from "react-icons/fa6";
import { FiPlus } from "react-icons/fi";
import Link from "next/link";
import { IoSettingsOutline } from "react-icons/io5";
import router from "next/router";
import CDropdown from "@/app/components/CDropdown";
import { useRouter } from "next/navigation";
import { statusColorMap, statusMap } from "@/constants";

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
  const dropdownOptions = [
    {
      label: "Aggiorna Account",
      value: "/protected/dashboard/account/completeAccount",
      href: "/protected/dashboard/account/completeAccount",
    },
    {
      label: "Reimposta Password",
      value: "/protected/reset-password",
      href: "/protected/reset-password",
    },
  ];

  return (
    <div className=" w-full">
      <div className="p-2 sm:p-12">
        <div className="flex flex-row items-center  gap-5">
          <h4>
            Benvenuto {userData?.name + " "}
            {userData.lastname && userData.lastname}
          </h4>
          <CDropdown
            options={dropdownOptions}
            placeholder={
              <span>
                <IoSettingsOutline size={20} />
              </span>
            }
          />
        </div>

        <p>{userData?.email}</p>
        <div>
          <div className=" grid w-full gap-2 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))] sm:[grid-template-columns:repeat(auto-fit,minmax(350px,1fr))]">
            <div className="ncard !py-1 !my-4 flex flex-col flex-wrap gap-4 w-full ">
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
                    <div className="inline-flex flex-wrap flex-row gap-5 items-center justify-between nborder p-4 !border-blue-300 border-1">
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
              <div className="inline-flex flex-wrap flex-row gap-5 items-center justify-between rounded-lg p-4 !border-red-200 border-1">
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
            <div className="ncard !py-1 !my-4 flex flex-col flex-wrap gap-4 w-full ">
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
                    const status = statusMap[setlist.status] ?? {
                      label: "Sconosciuto",
                      color: "text-gray-500",
                    };
                    const colorChip: ChipColor =
                      statusColorMap[setlist.status] ?? "default";
                    return (
                      <div key={setlist.id} className="!max-w-full p-2">
                        <div className="flex gap-3 relative">
                          <div className="flex flex-col w-full max-w-full">
                            <div className="flex justify-between max-w-full">
                              <p className="text-md font-medium">
                                {matched?.alt ||
                                  matched?.label ||
                                  "Evento sconosciuto"}
                              </p>
                              <>
                                <div className="sm-hide">
                                  <Chip
                                    className="capitalize text-center"
                                    color={colorChip}
                                    size="sm"
                                    variant="flat"
                                  >
                                    <span className={status.color}>
                                      {status.label}
                                    </span>
                                  </Chip>
                                </div>
                                <div className="md-hide">
                                  {setlist.status === "confirmed" && (
                                    <FaRegCheckCircle color={status.color} />
                                  )}
                                  {setlist.status === "pending" && (
                                    <FaRegClock color={status.color} />
                                  )}
                                  {setlist.status === "denied" && (
                                    <FaRegCircleXmark color={status.color} />
                                  )}
                                </div>
                              </>
                            </div>

                            <p className="text-small text-default-500 capitalize">
                              {readableDate}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <Link
                            className="text-sm  underline"
                            href={`/setlist/${setlist.setlist_id}`}
                          >
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
