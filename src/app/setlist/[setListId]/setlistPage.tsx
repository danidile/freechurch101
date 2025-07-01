"use client";
import { getSetList } from "@/hooks/GET/getSetList";
import { getSetListSongs } from "@/hooks/GET/getSetListSongs";
import {
  FaCircle,
  FaExclamation,
  FaRegCheckCircle,
  FaRegClock,
  FaWhatsapp,
} from "react-icons/fa";
import ModalLyrics from "./modalLyrics";
import CopyLinkButton from "@/app/components/CopyLinkButton";
import { addToast, Card, Tooltip } from "@heroui/react";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/react";

import { ChipColor, GroupedMembers, setListT } from "@/utils/types/types";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import MoreDropdownSetlist from "./MoreDropdownSetlist";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { getSetListTeams } from "@/hooks/GET/getSetListTeams";
import Link from "next/link";
import { Button } from "@heroui/button";
import { useUserStore } from "@/store/useUserStore";
import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Alert,
} from "@heroui/react";
import isTeamLeaderClient from "@/utils/supabase/isTeamLeaderClient";
import { RiSettings4Fill } from "react-icons/ri";
import { MdModeEdit } from "react-icons/md";
import { IoIosSend } from "react-icons/io";
import ContactTeamModal from "./contactTeamModal";
import ChurchLabLoader from "@/app/components/churchLabSpinner";
import { IoCloseCircleSharp, IoMailOutline } from "react-icons/io5";
import eventReminderEmail from "./eventReminderEmail";
import LoginForm from "@/app/(auth-pages)/login/loginForm";
import updateLastReminderSupabase from "./updateLastReminderSupabase";
import { FiSend } from "react-icons/fi";
import { getSetlistSchedule } from "@/hooks/GET/getSetlistSchedule";
import { ScheduleViewComponents } from "./ScheduleViewComponents";
import { FaRegCircleXmark } from "react-icons/fa6";
import { useChurchStore } from "@/store/useChurchStore";
import { statusColorMap, statusMap } from "@/constants";
export default function SetlistPage({ setListId }: { setListId: string }) {
  const { userData, fetchUser, loading } = useUserStore();
  const [setlistSchedule, setSetlistSchedule] = useState<any[] | null>(null);
  const [setlistData, setSetlistData] = useState<setListT | null>(null);
  const [setlistTeams, setSetlistTeams] = useState<GroupedMembers | null>(null);
  const [loadingSetlist, setLoadingSetlist] = useState(true);
  const [contactMode, setContactMode] = useState<boolean>(false);
  const [emailPerson, setEmailPerson] = useState(null);
  const [emailTeam, setEmailTeam] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { eventTypes } = useChurchStore();

  // Step 2: Once user is available, fetch songs
  useEffect(() => {
    if (!loading && userData.loggedIn) {
      getSetList(setListId).then((fetchedSetList: setListT) => {
        setSetlistData(fetchedSetList);
      });
      getSetlistSchedule(setListId).then(
        (fetchedSetListSchedule: setListT[]) => {
          setSetlistSchedule(fetchedSetListSchedule);
        }
      );
      getSetListTeams(setListId).then((fetchedSetLists) => {
        setSetlistTeams(fetchedSetLists);
        setLoadingSetlist(false);
      });
    }
  }, [loading, userData]);

  const [TeamLeader, setTeamLeader] = useState<boolean>(false);
  useEffect(() => {
    const fetchLeaderStatus = async () => {
      if (!loading && userData.loggedIn) {
        const leaderStatus = await isTeamLeaderClient();
        setTeamLeader(leaderStatus.isLeader);
      }
    };
    fetchLeaderStatus();
  }, [loading, userData]);

  if (!userData.loggedIn && !loading) {
    return (
      <div className="container-sub ">
        <Alert
          color="danger"
          className="max-w-[340px] mx-auto"
          description="Questa pagina è riservata ai membri della chiesa."
          title="Accesso bloccato"
        />

        <LoginForm />
      </div>
    );
  }
  if (loadingSetlist || !setlistData) {
    return <ChurchLabLoader />;
  }
  const date = new Date(setlistData.date);
  const readableDate = date.toLocaleString("it-IT", {
    weekday: "long", // "Sunday"
    year: "numeric", // "2024"
    month: "long", // "November"
    day: "numeric", // "10"
  });

  const matched = eventTypes?.find(
    (event) => event.key === setlistData.event_type
  );
  return (
    <div className="container-sub ">
      <div className="song-presentation-container">
        <div className="team-show">
          <h5> {matched?.alt || matched?.label || "Evento sconosciuto"}</h5>
          <p className="capitalize">{readableDate}</p>
          <div className="top-settings-bar">
            <CopyLinkButton />
            {userData &&
              (hasPermission(userData.role as Role, "create:setlists") ||
                TeamLeader) && (
                <MoreDropdownSetlist
                  userData={userData}
                  setlistId={setListId}
                />
              )}
          </div>
        </div>

        {setlistSchedule && setlistSchedule.length > 0 && (
          <>
            <Card className="mb-5 px-2 py-4">
              {setlistSchedule.map((element) => {
                return <ScheduleViewComponents element={element} />;
              })}
            </Card>
            <div className="center- gap-3 mt-5 mb-20">
              <Link href={`/setlist/${setListId}/view`}>
                <Button color="primary"> Visualizza set completo</Button>
              </Link>
            </div>
          </>
        )}

        {setlistTeams &&
          Object.entries(setlistTeams).map((team) => {
            const showEmail = hasPermission(
              userData.role as Role,
              "send:emails"
            );

            if (contactMode) {
              return (
                <>
                  <div className="team-show" key={team[0]}>
                    <Table
                      aria-label="Example table with dynamic content"
                      topContent={
                        <div className="flex flex-row justify-between">
                          <h5 className="font-medium">{team[0]}</h5>
                          {hasPermission(
                            userData.role as Role,
                            "send:emails"
                          ) && (
                            <Button
                              className="mr-0"
                              isIconOnly
                              onPress={() =>
                                setContactMode((prevState) => {
                                  return !prevState;
                                })
                              }
                            >
                              <FiSend />
                            </Button>
                          )}
                        </div>
                      }
                      classNames={{
                        td: "p-[2px] truncate text-center ",
                        th: "text-center",
                      }}
                    >
                      <TableHeader>
                        <TableColumn className="!text-left">Nome</TableColumn>
                        <TableColumn>Ruolo</TableColumn>
                        <TableColumn>Stato</TableColumn>
                        <TableColumn>
                          <IoMailOutline size={20} />
                        </TableColumn>
                        <TableColumn>
                          <FaWhatsapp size={20} />
                        </TableColumn>
                      </TableHeader>
                      <TableBody items={team[1]}>
                        {(item) => {
                          const status = statusMap[item.status] ?? {
                            label: "Sconosciuto",
                            color: "text-gray-500",
                          };
                          const lastEmailDate = new Date(item.last_email); // assuming ISO string like "2025-06-17T10:00:00Z"
                          const formattedDate =
                            lastEmailDate.toLocaleDateString("it-IT", {
                              day: "numeric",
                              month: "long",
                            });
                          const now = new Date();

                          const timeDiff =
                            now.getTime() - lastEmailDate.getTime();
                          const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

                          const recentlyEmailed = daysDiff < 2;
                          const colorChip: ChipColor =
                            statusColorMap[item.status] ?? "default";
                          let whatsappURL = "";
                          if (item.phone) {
                            const message = `Ciao ${item.name}! 
Volevo ricordarti che sei di turno con il *${team[0]} ${readableDate}* 
Se non hai ancora confermato la tua presenza su ChurchLab, ti chiedo gentilmente di farlo ora.
Grazie per il tuo servizio! Se hai dubbi o imprevisti, fammi sapere.`;

                            const encodedMessage = encodeURIComponent(message);
                            whatsappURL = `https://wa.me/${item.phone.replace(/\s+/g, "")}?text=${encodedMessage}`;
                          }

                          return (
                            <TableRow key={item.profile}>
                              <TableCell>
                                <p className="flex flex-row gap-2 items-center truncate">
                                  {item.name} {item.lastname}
                                </p>
                              </TableCell>
                              <TableCell>
                                <p>{item.selected_roles}</p>
                              </TableCell>
                              <TableCell>
                                <div className="sm:block hidden">
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
                                <div className="sm:hidden  w-full flex flex-row items-center justify-center">
                                  <FaCircle color={status.color} />
                                </div>
                              </TableCell>
                              <TableCell>
                                {recentlyEmailed ? (
                                  <Popover placement="right">
                                    <PopoverTrigger>
                                      <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        color="danger"
                                      >
                                        <FaExclamation />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                      <div className="px-1 py-2">
                                        <div className="text-small font-bold">
                                          Email inviata di recente
                                        </div>
                                        <div className="text-tiny">
                                          Puoi inviare un nuovo promemoria solo
                                          dopo 2 giorni.
                                          <br />
                                          <span className="capitalize underline">
                                            Ultima Email {formattedDate}
                                          </span>
                                        </div>
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                ) : (
                                  <Button
                                    variant="light"
                                    isIconOnly
                                    onPress={() => {
                                      setEmailPerson(item);
                                      setEmailTeam(team[0]);
                                      onOpen();
                                    }}
                                  >
                                    <IoMailOutline size={24} />
                                  </Button>
                                )}
                              </TableCell>

                              <TableCell>
                                {item.phone && (
                                  <Button
                                    as={Link}
                                    href={whatsappURL}
                                    variant="light"
                                    isIconOnly
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="whatsapp-button"
                                  >
                                    <FaWhatsapp size={24} />
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        }}
                      </TableBody>
                    </Table>
                  </div>
                </>
              );
            } else {
              return (
                <>
                  <div className="team-show" key={team[0]}>
                    <Table
                      aria-label="Example table with dynamic content"
                      topContent={
                        <div className="flex flex-row justify-between">
                          <h5 className="font-medium">{team[0]}</h5>
                          {hasPermission(
                            userData.role as Role,
                            "send:emails"
                          ) && (
                            <Button
                              className="mr-0"
                              isIconOnly
                              onPress={() =>
                                setContactMode((prevState) => {
                                  return !prevState;
                                })
                              }
                            >
                              <FiSend />
                            </Button>
                          )}
                        </div>
                      }
                      classNames={{
                        td: "p-[2px] truncate text-center ",
                        th: " text-center",
                      }}
                    >
                      <TableHeader>
                        <TableColumn className="!text-left">Nome</TableColumn>
                        <TableColumn>Ruolo</TableColumn>
                        <TableColumn>Stato</TableColumn>
                      </TableHeader>
                      <TableBody items={team[1]}>
                        {(item) => {
                          const status = statusMap[item.status] ?? {
                            label: "Sconosciuto",
                            color: "text-gray-500",
                          };

                          const colorChip: ChipColor =
                            statusColorMap[item.status] ?? "default";
                          let whatsappURL = "";

                          return (
                            <TableRow key={item.profile}>
                              <TableCell>
                                <p className="flex flex-row gap-2 items-center truncate">
                                  {item.name} {item.lastname}
                                </p>
                              </TableCell>
                              <TableCell>
                                <p>{item.selected_roles}</p>
                              </TableCell>
                              <TableCell>
                                <div className="sm:block hidden">
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

                                <div className="sm:hidden  w-full flex flex-row items-center justify-center">
                                  {item.status === "confirmed" && (
                                    <FaRegCheckCircle color={status.color} />
                                  )}
                                  {item.status === "pending" && (
                                    <FaRegClock color={status.color} />
                                  )}
                                  {item.status === "denied" && (
                                    <FaRegCircleXmark color={status.color} />
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        }}
                      </TableBody>
                    </Table>
                  </div>
                </>
              );
            }
          })}
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Invia Email
              </ModalHeader>
              <ModalBody>
                <b>
                  Destinatario: {emailPerson.name + " " + emailPerson.lastname}
                </b>
                <b>Email: {emailPerson.email}</b>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    setEmailPerson(null);
                    onClose();
                  }}
                >
                  Chiudi
                </Button>
                <Button
                  color="primary"
                  onPress={async () => {
                    const response = await eventReminderEmail(
                      emailPerson,
                      emailTeam,
                      readableDate,
                      setListId
                    );
                    console.log(response);
                    if (response.error) {
                      addToast({
                        title: `Errore nell'invio della mail a ${emailPerson.name}`,
                        description: response.error,
                        icon: <IoIosSend />,
                        color: "danger",
                      });
                    } else {
                      addToast({
                        title: `Email Inviata con successo a ${emailPerson.name}`,
                        description: response.message,
                        icon: <IoIosSend />,
                        color: "success",
                      });
                    }
                    updateLastReminderSupabase(
                      emailPerson,
                      emailTeam,
                      readableDate,
                      setListId
                    );
                    setEmailPerson(null);

                    onClose();
                  }}
                >
                  Invia
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
