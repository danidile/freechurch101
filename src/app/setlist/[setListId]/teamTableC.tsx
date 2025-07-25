"use client";

import {
  FaExclamation,
  FaRegCheckCircle,
  FaRegClock,
  FaWhatsapp,
} from "react-icons/fa";
import { addToast } from "@heroui/react";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { ChipColor } from "@/utils/types/types";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { useState } from "react";
import { Chip } from "@heroui/react";
import { IoIosSend } from "react-icons/io";
import { IoMailOutline } from "react-icons/io5";
import eventReminderEmail from "./eventReminderEmail";
import updateLastReminderSupabase from "./updateLastReminderSupabase";
import { FaRegCircleXmark } from "react-icons/fa6";
import { statusColorMap, statusMap } from "@/constants";

interface TeamTableProps {
  members: any[];
  teamName: string;
  readableDate: string;
  setListId: string;
  contactMode: boolean;
  onTeamsUpdate: () => void;
}

export default function TeamTable({
  members,
  teamName,
  readableDate,
  setListId,
  contactMode,
  onTeamsUpdate,
}: TeamTableProps) {
  const [emailState, setEmailState] = useState({
    sending: false,
    person: null,
    team: null,
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleEmailSend = async () => {
    if (!emailState.person) return;

    setEmailState((prev) => ({ ...prev, sending: true }));

    try {
      const response = await eventReminderEmail(
        emailState.person,
        emailState.team,
        readableDate,
        setListId
      );

      if (response.error) {
        addToast({
          title: `Errore nell'invio della mail a ${emailState.person.name}`,
          description: response.error,
          icon: <IoIosSend />,
          color: "danger",
        });
      } else {
        addToast({
          title: `Email Inviata con successo a ${emailState.person.name}`,
          description: response.message,
          icon: <IoIosSend />,
          color: "success",
        });
      }

      await updateLastReminderSupabase(
        emailState.person,
        emailState.team,
        readableDate,
        setListId
      );

      onTeamsUpdate();
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setEmailState({ sending: false, person: null, team: null });
    }
  };

  return (
    <>
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
              const status = statusMap[item.status] ?? {
                label: "Sconosciuto",
                color: "text-gray-500",
              };
              const colorChip: ChipColor =
                statusColorMap[item.status] ?? "default";

              const lastEmailDate = new Date(item.last_email);
              const daysDiff =
                (Date.now() - lastEmailDate.getTime()) / (1000 * 60 * 60 * 24);
              const recentlyEmailed = daysDiff < 2;

              let whatsappURL = "";
              if (item.phone) {
                const message = `Ciao ${item.name}! 
Volevo ricordarti che sei di turno con il *${teamName} ${readableDate}* 
Se non hai ancora confermato la tua presenza su ChurchLab, ti chiedo gentilmente di farlo ora.
Grazie per il tuo servizio! Se hai dubbi o imprevisti, fammi sapere.`;
                whatsappURL = `https://wa.me/${item.phone.replace(/\s+/g, "")}?text=${encodeURIComponent(message)}`;
              }

              return (
                <tr key={item.profile}>
                  <td
                    className={`truncate ${item.lead ? "font-bold underline" : ""}`}
                  >
                    {item.name} {item.lastname}
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
                        <span className={status.color}>{status.label}</span>
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

                  {contactMode && (
                    <td className="actions center">
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
                              <strong>Email inviata di recente</strong>
                              <p>
                                Puoi inviare un nuovo promemoria solo dopo 2
                                giorni.
                                <br />
                                <span className="underline">
                                  Ultima Email{" "}
                                  {lastEmailDate.toLocaleDateString("it-IT", {
                                    day: "numeric",
                                    month: "long",
                                  })}
                                </span>
                              </p>
                            </div>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <button
                          onClick={() => {
                            setEmailState({
                              sending: false,
                              person: item,
                              team: teamName,
                            });
                            onOpen();
                          }}
                          className="p-1"
                        >
                          <IoMailOutline size={20} />
                        </button>
                      )}
                    </td>
                  )}

                  {contactMode && (
                    <td className="actions center">
                      {item.phone && (
                        <a className="icon-btn" href={whatsappURL}>
                          <FaWhatsapp size={20} className="text-green-500" />
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

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Invia Email
              </ModalHeader>
              <ModalBody>
                <b>
                  Destinatario:{" "}
                  {emailState.person?.name + " " + emailState.person?.lastname}
                </b>
                <b>Email: {emailState.person?.email}</b>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    setEmailState({ sending: false, person: null, team: null });
                    onClose();
                  }}
                >
                  Chiudi
                </Button>
                <Button
                  disabled={emailState.sending}
                  color="primary"
                  className={`${emailState.sending ? "opacity-50 cursor-not-allowed" : ""}`}
                  onPress={async () => {
                    await handleEmailSend();
                    onClose();
                  }}
                >
                  {emailState.sending ? (
                    <div
                      className="h-6 mx-auto w-6 animate-spin rounded-full border-4 border-[#ffffff00] border-t-gray-200"
                      aria-label="Loading..."
                    />
                  ) : (
                    "Invia"
                  )}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
