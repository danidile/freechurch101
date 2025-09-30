"use client";
import { getProfileSetList } from "@/hooks/GET/getProfileSetLists";
import { useUserStore } from "@/store/useUserStore";
import { ChipColor, profileSetlistsT } from "@/utils/types/types";
import { Button, Chip, Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import { MdEvent } from "react-icons/md";
import { Alert } from "@heroui/alert";
import { getPendingChurchMembershipRequests } from "@/hooks/GET/getPendingChurchMembershipRequests";
import {
  FaExternalLinkAlt,
  FaRegCheckCircle,
  FaRegClock,
} from "react-icons/fa";
import { LuCalendarOff, LuUserRoundPlus } from "react-icons/lu";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { useChurchStore } from "@/store/useChurchStore";
import { FaLink, FaRegCircleXmark } from "react-icons/fa6";
import { FiPlus } from "react-icons/fi";
import Link from "next/link";
import { IoSettingsOutline } from "react-icons/io5";
import CDropdown from "@/app/components/CDropdown";
import { statusColorMap, statusMap } from "@/constants";

export default function AccountComponent() {
  const { userData, loading } = useUserStore();
  const { churchMembers } = useChurchStore();
  const [setlists, setSetlists] = useState<any[] | null>([]);
  const [pendingRequests, setPendingRequests] = useState(false);
  const { eventTypes } = useChurchStore();

  useEffect(() => {
    console.log(loading);
    const fetchData = async () => {
      if (!loading && userData) {
        const fetchedProfileSetLists = await getProfileSetList(userData.id);
        setSetlists(fetchedProfileSetLists);

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
            positionOnMobile="right"
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
              {hasPermission(userData.role as Role, "read:churchmembers") && (
                <>
                  {churchMembers?.length <= 10 && (
              <div className="bg-gray-50 inline-flex flex-wrap flex-row gap-5 items-center justify-between rounded-xl p-4">
                <p>Invita nuovi membri nella tua chiesa!</p>
                <Button
                  startContent={<LuUserRoundPlus size={20} />}
                  color="primary"
                  radius="sm"
                  className="w-[150px]"
                  as={Link}
                  href="/protected/church/invitemembers"
                >
                  Invita!
                </Button>
              </div>
              )}
                </>
              )}
              <div className="bg-gray-50 inline-flex flex-wrap flex-row gap-5 items-center justify-between rounded-xl p-4">
                <p>Blocca le date in cui non sei disponibile.</p>
                <Button
                  startContent={<LuCalendarOff size={20} />}
                  radius="sm"
                  className="bg-[#ea685c] text-white w-[150px]"
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
