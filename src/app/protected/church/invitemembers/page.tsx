"use client";

import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Chip,
  ModalFooter,
} from "@heroui/react";

import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import sendInvitesAction from "../personalize/sendInvitesAction";
import sendInviteEmail from "../personalize/sendInviteEmail";
import { getInvitesByChurch } from "@/hooks/GET/getInvitesByChurch";
import { FaCircle, FaExclamation } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";
import { ChipColor, newMember } from "@/utils/types/types";
import { statusColorMap, statusMap } from "@/constants";
import checkInvitesAction from "./checkInvitesAction";

export default function InviteUsersModalComponent() {
  const { userData, loading } = useUserStore();
  const [members, setMembers] = useState<newMember[]>([
    { name: "", lastname: "", email: "" },
  ]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [checkedMembers, setCheckedMembers] = useState<newMember[]>([]);
  const [invitesSent, setInvitesSent] = useState<newMember[]>([]);
  const [emailPerson, setEmailPerson] = useState(null);
  const [refetchTrigger, setRefetchTrigger] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | "all">("all");

  useEffect(() => {
    if (!loading && userData.loggedIn) {
      getInvitesByChurch(userData.church_id).then((fetchedEventTypes) => {
        console.log("fetchedEventTypes", fetchedEventTypes);
        setInvitesSent(fetchedEventTypes);
      });
    }
  }, [loading, userData, refetchTrigger]);
  const addMember = () => {
    setMembers([...members, { name: "", lastname: "", email: "" }]);
  };

  const handleMembersInputChange = (
    index: number,
    field: keyof newMember,
    value: string
  ) => {
    const updated: newMember[] = [...members];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setMembers(updated);
  };
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const sendInvites = async () => {
    const filteredMembers = checkedMembers.filter((member) => !member.error);
    if (filteredMembers.length >= 1) {
      const invitesAdded: newMember[] =
        await sendInvitesAction(filteredMembers);

      await Promise.all(
        invitesAdded.map((newMember) => sendInviteEmail(newMember))
      );

      setRefetchTrigger((prev) => !prev);
      setMembers([{ name: "", lastname: "", email: "" }]);
    }
  };

  const checkInvites = async () => {
    const today = new Date().toISOString().split("T")[0];
    const seenEmails = new Set<string>();

    const formattedNewMembers = await Promise.all(
      members.map(async (newMember) => {
        const isValid = isValidEmail(newMember.email);
        const alreadySeen = seenEmails.has(newMember.email);

        if (
          isValid &&
          newMember.name.length >= 2 &&
          newMember.lastname.length >= 2
        ) {
          const token = crypto.randomUUID();
          const result = {
            email: newMember.email,
            church: userData.church_id,
            token,
            status: "pending",
            name: newMember.name,
            lastname: newMember.lastname,
            last_email: today,
            ...(alreadySeen ? { error: "Duplicate email" } : {}),
          };

          seenEmails.add(newMember.email);
          return result;
        }

        return {
          email: newMember.email,
          name: newMember.name,
          lastname: newMember.lastname,
          error: !isValid ? "Email non valida" : "Nome o cognome troppo corti",
        };
      })
    );

    const filteredMembers = formattedNewMembers.filter(Boolean); // removes undefined
    if (filteredMembers.length >= 1) {
      const invitesChecked: newMember[] = await checkInvitesAction(
        filteredMembers,
        userData.church_id
      );
      setCheckedMembers(invitesChecked);
    }
  };
  const filteredInvites = invitesSent.filter((member) => {
    const fullName = `${member.name} ${member.lastname}`.toLowerCase();
    const email = member.email.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || member.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  return (
    <div className="nborder ncard ">
      {invitesSent.length >= 1 && (
        <>
          <h3 className="my-4">Inviti già inviati</h3>
          <div className="flex flex-col sm:flex-row items-start  sm:items-center justify-between gap-2 mb-4">
            <p className="min-w-[40px]">Filtri:</p>
            <input
              type="text"
              placeholder="Cerca per nome o email..."
              className="px-3 py-2 border rounded-md text-sm w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="px-3 py-2 border w-full rounded-md text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tutti gli stati</option>
              <option value="pending">In attesa</option>
              <option value="confirmed">Accettato</option>
            </select>
          </div>

          <table className="btable">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Ultima Email</th>
                <th>Stato</th>
                <th>Invia email</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvites.map((member, index) => {
                const lastEmailDate = new Date(member.last_email);
                const formattedDate = lastEmailDate.toLocaleDateString(
                  "it-IT",
                  {
                    day: "numeric",
                    month: "long",
                  }
                );
                const now = new Date();
                const timeDiff = now.getTime() - lastEmailDate.getTime();
                const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
                const recentlyEmailed = daysDiff < 2;
                const status = statusMap[member.status] ?? {
                  label: "Sconosciuto",
                  color: "text-gray-500",
                };
                const colorChip: ChipColor =
                  statusColorMap[member.status] ?? "default";

                return (
                  <tr key={index}>
                    <td className="btable-name">
                      <p>{member.name + " " + member.lastname}</p>
                      <small>{member.email}</small>
                    </td>
                    <td className="capitalize">{formattedDate}</td>
                    <td>
                      <div className="btable-chip-container">
                        <Chip
                          className="capitalize text-center"
                          color={colorChip}
                          size="sm"
                          variant="flat"
                        >
                          <span className={status.color}>{status.label}</span>
                        </Chip>
                      </div>
                      <div className="btable-chip-icon">
                        <FaCircle color={status.color} />
                      </div>
                    </td>
                    <td className="btable-mail-button">
                      {member.status !== "confirmed" && (
                        <>
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
                                    Puoi inviare un nuovo promemoria solo dopo 2
                                    giorni.
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
                                setEmailPerson(member);
                              }}
                            >
                              <IoMailOutline size={24} />
                            </Button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}

      <h3 className="my-4">Invia nuovi inviti</h3>

      {/* Table with the NEW INVITES */}
      <table className="w-full max-w-4xl border-0 border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className=" px-1 py-2 text-center">Nome</th>
            <th className=" px-1 py-2 text-center">Cognome</th>
            <th className=" px-1 py-2 text-center">Email</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => {
            return (
              <tr key={index} className="border-b">
                <td className="">
                  <input
                    required
                    type="text"
                    value={member.name}
                    onChange={(e) =>
                      handleMembersInputChange(index, "name", e.target.value)
                    }
                    placeholder="Alberto..."
                    className="w-full rounded-none! px-2 py-1 border-0 border-gray-300 text-sm font-normal "
                  />
                </td>
                <td>
                  <input
                    required
                    placeholder="Rossi..."
                    type="text"
                    value={member.lastname}
                    onChange={(e) =>
                      handleMembersInputChange(
                        index,
                        "lastname",
                        e.target.value
                      )
                    }
                    className="w-full px-2 py-1 border-0 border-gray-300 rounded  text-sm font-normal"
                  />
                </td>
                <td>
                  <input
                    required
                    placeholder="lamia@email.com..."
                    type="email"
                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                    value={member.email}
                    onChange={(e) =>
                      handleMembersInputChange(index, "email", e.target.value)
                    }
                    className="w-full px-2 py-1 border-0 border-gray-300 rounded  text-sm font-normal"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="w-full flex flex-col justify-center">
        <Button
          onPress={() => addMember()}
          color="primary"
          variant="flat"
          className=" my-3"
        >
          Aggiungi persona
        </Button>
      </div>

      <div className="flex flex-row gap-4">
        <Button
          type="submit"
          fullWidth
          className="mt-6"
          color="primary"
          onPress={() => {
            onOpen();
            checkInvites();
          }}
        >
          Aggiungi
        </Button>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Invia inviti
              </ModalHeader>
              <ModalBody>
                <small>
                  Le email il box rosso non verranno invitate in o già
                  possiedono un account o hanno già ricevuto un invito dalla tua
                  chiesa.
                </small>
                {checkedMembers.length >= 1 && (
                  <div className="flex flex-col  gap-2">
                    {checkedMembers.map((member, index) => {
                      return (
                        <div
                          key={index}
                          className={`p-4 nborder w-full ${member?.error ? "bg-red-100!" : ""}`}
                        >
                          <p
                            className={`${member?.error ? "text-red-700!" : ""}`}
                          >
                            {member.name + " " + member.lastname}
                          </p>
                          <small
                            className={`${member?.error ? "text-red-500!" : ""}`}
                          >
                            {member?.error && member?.error}
                            {!member?.error && member?.email}
                          </small>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Annulla
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    onClose();
                    sendInvites();
                  }}
                >
                  Invia inviti
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
