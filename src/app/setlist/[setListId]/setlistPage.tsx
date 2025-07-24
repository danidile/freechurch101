"use client";
import { getSetList } from "@/hooks/GET/getSetList";
import {
  FaExclamation,
  FaRegCheckCircle,
  FaRegClock,
  FaWhatsapp,
} from "react-icons/fa";
import CopyLinkButton from "@/app/components/CopyLinkButton";
import { addToast } from "@heroui/react";
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
import { useState, useEffect } from "react";
import { Chip, Alert } from "@heroui/react";
import isTeamLeaderClient from "@/utils/supabase/isTeamLeaderClient";
import { IoIosSend } from "react-icons/io";
import ChurchLabLoader from "@/app/components/churchLabSpinner";
import { IoMailOutline } from "react-icons/io5";
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
  const { userData, loading } = useUserStore();
  const [setlistSchedule, setSetlistSchedule] = useState<any[] | null>(null);
  const [setlistData, setSetlistData] = useState<setListT | null>(null);
  const [setlistTeams, setSetlistTeams] = useState<GroupedMembers | null>(null);
  const [loadingSetlist, setLoadingSetlist] = useState(true);
  const [contactMode, setContactMode] = useState<boolean>(false);
  const [emailSending, setEmailSending] = useState<boolean>(false);
  const [emailPerson, setEmailPerson] = useState(null);
  const [emailTeam, setEmailTeam] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { eventTypes, rooms } = useChurchStore();

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
  const setlistRoom = rooms?.find((room) => room.id === setlistData.room);
  return (
    <div className="container-sub ">
      <div className="song-presentation-container">
        <div className="team-show">
          <div className="flex flex-wrap justify-between">
            <h2> {matched?.alt || matched?.label || "Evento sconosciuto"}</h2>
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
            </div>{" "}
          </div>

          <p className="capitalize my-2">
            {" "}
            <b> ora: </b>
            {readableDate}
          </p>
          <p className="my-2">
            <b> Location: </b>
            {setlistRoom?.name}
            {" - "} {setlistRoom?.address}
          </p>
        </div>

        {setlistSchedule && setlistSchedule.length > 0 && (
          <>
            {" "}
            <h5 className="font-medium">Scaletta</h5>
            <div className=" mb-2 px-3 py-4">
              {setlistSchedule.map((element, index) => {
                return (
                  <div key={index}>
                    <ScheduleViewComponents element={element} />
                  </div>
                );
              })}
            </div>
            <div className="center- gap-3 mt-5 mb-5">
              <Link href={`/setlist/${setListId}/view`}>
                <Button color="primary"> Visualizza set completo</Button>
              </Link>
            </div>
          </>
        )}

        {setlistTeams &&
          Object.entries(setlistTeams).map(([teamName, members]) => {
            const showEmail = hasPermission(
              userData.role as Role,
              "send:emails"
            );

            return (
              <div className="team-show mb-6" key={teamName}>
                {/* ——— Top bar with title + toggle */}
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-medium">{teamName}</h5>
                  {showEmail && (
                    <button
                      className="text-gray-600 hover:text-gray-800"
                      onClick={() => setContactMode((prev) => !prev)}
                    >
                      <FiSend size={20} />
                    </button>
                  )}
                </div>
                <div className="atable-container">
                  <table className="atable">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Ruolo</th>
                        <th className="center">Stato</th>
                        {contactMode && <th className="center">Email</th>}
                        {contactMode && <th className="center">WhatsApp</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((item) => {
                        // — Status logic
                        const status = statusMap[item.status] ?? {
                          label: "Sconosciuto",
                          color: "text-gray-500",
                        };
                        const colorChip: ChipColor =
                          statusColorMap[item.status] ?? "default";

                        // — Recent email?
                        const lastEmailDate = new Date(item.last_email);
                        const daysDiff =
                          (Date.now() - lastEmailDate.getTime()) /
                          (1000 * 60 * 60 * 24);
                        const recentlyEmailed = daysDiff < 2;

                        // — WhatsApp URL
                        let whatsappURL = "";
                        if (item.phone) {
                          const message = `Ciao ${item.name}! 
Volevo ricordarti che sei di turno con il *${teamName} ${readableDate}* 
Se non hai ancora confermato la tua presenza su ChurchLab, ti chiedo gentilmente di farlo ora.
Grazie per il tuo servizio! Se hai dubbi o imprevisti, fammi sapere.`;
                          whatsappURL = `https://wa.me/${item.phone.replace(
                            /\s+/g,
                            ""
                          )}?text=${encodeURIComponent(message)}`;
                        }

                        return (
                          <tr key={item.profile}>
                            <td
                              className={`truncate ${item.lead ? "font-bold underline" : ""}`}
                            >
                              {item.name} {item.lastname}{" "}
                            </td>
                            <td>{item.selected_roles}</td>
                            <td className="center">
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
                            </td>

                            {/* Email column (only in contactMode) */}
                            {contactMode && (
                              <td className="actions center">
                                {" "}
                                {recentlyEmailed ? (
                                  <Popover placement="right">
                                    <PopoverTrigger>
                                      <button className="p-1">
                                        <FaExclamation
                                          size={16}
                                          className="text-red-500"
                                        />
                                      </button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                      <div className="p-2 text-sm">
                                        <strong>
                                          Email inviata di recente
                                        </strong>
                                        <p>
                                          Puoi inviare un nuovo promemoria solo
                                          dopo 2 giorni.
                                          <br />
                                          <span className="underline">
                                            Ultima Email{" "}
                                            {lastEmailDate.toLocaleDateString(
                                              "it-IT",
                                              {
                                                day: "numeric",
                                                month: "long",
                                              }
                                            )}
                                          </span>
                                        </p>
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setEmailPerson(item);
                                      setEmailTeam(teamName);
                                      onOpen();
                                    }}
                                    className="p-1"
                                  >
                                    <IoMailOutline size={20} />
                                  </button>
                                )}
                              </td>
                            )}

                            {/* WhatsApp column (only in contactMode) */}
                            {contactMode && (
                              <td className="actions center">
                                {" "}
                                {item.phone && (
                                  <a className="icon-btn" href={whatsappURL}>
                                    <FaWhatsapp
                                      size={20}
                                      className="text-green-500"
                                    />
                                  </a>
                                )}
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
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
                  disabled={emailSending}
                  color="primary"
                  className={`${emailSending ? "opacity-50 cursor-not-allowed" : ""}`}
                  onPress={async () => {
                    setEmailSending(true);
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
                    setEmailSending(false);
                    getSetListTeams(setListId).then((fetchedSetLists) => {
                      setSetlistTeams(fetchedSetLists);
                      setLoadingSetlist(false);
                    });
                  }}
                >
                  {emailSending ? (
                    <div
                      className="h-6 mx-auto w-6 animate-spin rounded-full border-4 border-[#ffffff00] border-t-gray-200"
                      aria-label="Loading..."
                    />
                  ) : (
                    <> Invia</>
                  )}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
