"use client";
import { getSetList } from "@/hooks/GET/getSetList";
import { getSetListSongs } from "@/hooks/GET/getSetListSongs";
import { FaWhatsapp } from "react-icons/fa";
import ModalLyrics from "./modalLyrics";
import CopyLinkButton from "@/app/components/CopyLinkButton";
import { addToast } from "@heroui/react";

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
import { IoMailOutline } from "react-icons/io5";
import eventReminderEmail from "./eventReminderEmail";
import LoginForm from "@/app/(auth-pages)/login/loginForm";
export default function SetlistPage({ setListId }: { setListId: string }) {
  const { userData, fetchUser, loading } = useUserStore();
  const [setlistSongs, setSetlistSongs] = useState<any[] | null>(null);
  const [setlistData, setSetlistData] = useState<setListT | null>(null);
  const [setlistTeams, setSetlistTeams] = useState<GroupedMembers | null>(null);
  const [loadingSetlist, setLoadingSetlist] = useState(true);
  const [contactMode, setContactMode] = useState(false);
  const [emailPerson, setEmailPerson] = useState(null);
  const [emailTeam, setEmailTeam] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Step 2: Once user is available, fetch songs
  useEffect(() => {
    if (!loading && userData.loggedIn) {
      getSetList(setListId).then((fetchedSetList: setListT) => {
        setSetlistData(fetchedSetList);
      });
      getSetListSongs(setListId).then((fetchedSetListSongs: setListT[]) => {
        setSetlistSongs(fetchedSetListSongs);
      });
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

  const statusColorMap: Record<string, ChipColor> = {
    pending: "warning",
    confirmed: "success",
    denied: "danger",
  };
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

  return (
    <div className="container-sub">
      <div className="song-presentation-container">
        <div className="team-show">
          <h6>
            <strong className="capitalize">{setlistData.event_title}</strong>
          </h6>
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

        {setlistSongs.length > 0 && (
          <>
            <Table
              key="Songs-table"
              aria-label="Team members table"
              topContent={<h6 className="font-bold">Canzoni</h6>}
            >
              <TableHeader>
                <TableColumn>Titolo</TableColumn>
                <TableColumn>Tonalità</TableColumn>
                <TableColumn>Visualizza</TableColumn>
              </TableHeader>
              <TableBody items={setlistSongs.sort((a, b) => a.order - b.order)}>
                {(song) => (
                  <TableRow key={song.id}>
                    <TableCell>
                      <strong>{song.song_title}</strong>{" "}
                    </TableCell>
                    <TableCell>{song.key}</TableCell>
                    <TableCell>
                      <ModalLyrics songData={song} />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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
            const showWhatsapp =
              showEmail && team[1].some((person) => person.phone);
            return (
              <>
                <div className="team-show">
                  <Table
                    aria-label="Example table with dynamic content"
                    topContent={<h6 className="font-bold">{team[0]}</h6>}
                  >
                    <TableHeader>
                      <TableColumn>Nome</TableColumn>
                      <TableColumn>Ruolo</TableColumn>
                      <TableColumn>Stato</TableColumn>
                      {hasPermission(userData.role as Role, "send:emails") && (
                        <>
                          <TableColumn
                            className={`${showWhatsapp ? "table-cell" : "hidden"}`}
                          >
                            Messaggio
                          </TableColumn>
                          <TableColumn>Email</TableColumn>
                        </>
                      )}
                    </TableHeader>
                    <TableBody items={team[1]}>
                      {(item) => {
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
                              <div className="flex flex-row gap-2 items-center ">
                                {item.name} {item.lastname}
                              </div>
                            </TableCell>
                            <TableCell>
                              <p>{item.selected_roles}</p>
                            </TableCell>
                            <TableCell>
                              <Chip
                                className="capitalize text-center"
                                color={colorChip}
                                size="sm"
                                variant="flat"
                              >
                                {item.status === "pending" && <>In attesa</>}
                                {item.status === "confirmed" && <>Confermato</>}
                                {item.status === "denied" && <>Rifiutato</>}
                              </Chip>
                            </TableCell>
                            {hasPermission(
                              userData.role as Role,
                              "create:setlists"
                            ) && (
                              <>
                                <TableCell
                                  className={`text-center ${contactMode ? "hidden" : "table-cell"}`}
                                >
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
                                </TableCell>
                              </>
                            )}
                            {hasPermission(
                              userData.role as Role,
                              "create:setlists"
                            ) && (
                              <>
                                <TableCell
                                  className={`text-center ${contactMode ? "hidden" : "table-cell"}`}
                                >
                                  {item.phone && (
                                    <>
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
                                    </>
                                  )}
                                </TableCell>
                              </>
                            )}
                          </TableRow>
                        );
                      }}
                    </TableBody>
                  </Table>
                </div>
              </>
            );
          })}
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
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
