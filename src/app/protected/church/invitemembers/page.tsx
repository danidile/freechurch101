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
} from "@heroui/react";

import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import sendInvitesAction from "../personalize/sendInvitesAction";
import sendInviteEmail from "../personalize/sendInviteEmail";
import { getInvitesByChurch } from "@/hooks/GET/getInvitesByChurch";
import { FaCircle, FaExclamation } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";
import { ChipColor, newMember } from "@/utils/types/types";
import { statusColorMap, statusMap } from "@/constants";
type Member = {
  last_email?: string;
  name: string;
  lastname: string;
  email: string;
  status?: string;
};
export default function InviteUsersModalComponent() {
  const { userData, loading } = useUserStore();
  const [members, setMembers] = useState<Member[]>([
    { name: "", lastname: "", email: "" },
  ]);
  const [invitesSent, setInvitesSent] = useState<Member[]>([]);
  const [emailPerson, setEmailPerson] = useState(null);
  const [refetchTrigger, setRefetchTrigger] = useState(false);

  const {
    isOpen: isOpenInviteModal,
    onOpen: onOpenInviteModal,
    onOpenChange: onOpenChangeInviteModal,
  } = useDisclosure();

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
    field: keyof Member,
    value: string
  ) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const sendInvites = async () => {
    console.log("members", members);
    const today = new Date().toISOString().split("T")[0];

    const formattedNewMembers = await Promise.all(
      members.map(async (newMember) => {
        const isValid = isValidEmail(newMember.email);
        if (
          isValid &&
          newMember.name.length >= 2 &&
          newMember.lastname.length >= 2
        ) {
          console.log(newMember);
          const token = crypto.randomUUID();

          return {
            email: newMember.email,
            church: userData.church_id,
            token: token,
            status: "pending",
            name: newMember.name,
            lastname: newMember.lastname,
            last_email: today,
          };
        }
      })
    );
    const filteredMembers = formattedNewMembers.filter(Boolean); // removes undefined
    if (filteredMembers.length >= 1) {
      const invitesAdded: newMember[] =
        await sendInvitesAction(filteredMembers);
      invitesAdded.map(async (newMember) => {
        const response = await sendInviteEmail(newMember);
        console.log("Email inviata a", newMember.email, response);
      });

      setRefetchTrigger(!refetchTrigger);
    }
  };

  return (
    <div className="nborder ncard ">
      {invitesSent.length >= 1 && (
        <>
          <h3 className="my-4">Inviti già inviati</h3>
          <table className="w-full max-w-6xl border-0 border-gray-300 text-sm max-h-[600px]">
            <thead>
              <tr className="bg-gray-100">
                <th className=" px-1 py-2 text-center">Nome</th>
                <th className=" px-1 py-2 text-center">Ultima Email</th>
                <th className=" px-1 py-2 text-center">Stato</th>
                <th className=" px-1 py-2 text-center">Invia email</th>
              </tr>
            </thead>
            <tbody>
              {/* Table with the INVITES  already sent*/}

              {invitesSent.map((member, index) => {
                const lastEmailDate = new Date(member.last_email); // assuming ISO string like "2025-06-17T10:00:00Z"
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
                  <tr key={index} className="border-b-1 ">
                    <td className="p-2">
                      <p>{member.name + " " + member.lastname}</p>
                      <small>{member.email}</small>
                    </td>
                    <td className=" text-center capitalize">{formattedDate}</td>
                    <td className=" text-center">
                      <div className="sm:block hidden">
                        <Chip
                          className="capitalize text-center"
                          color={colorChip}
                          size="sm"
                          variant="flat"
                        >
                          <span className={status.color}>{status.label}</span>
                        </Chip>
                      </div>
                      <div className="sm:hidden  w-full flex flex-row items-center justify-center">
                        <FaCircle color={status.color} />
                      </div>
                    </td>

                    <td className=" text-center">
                      {" "}
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
              <tr key={index} className="border-b-1">
                <td className="">
                  <input
                    required
                    type="text"
                    value={member.name}
                    onChange={(e) =>
                      handleMembersInputChange(index, "name", e.target.value)
                    }
                    placeholder="Alberto..."
                    className="w-full !rounded-none px-2 py-1 border-0 border-gray-300 text-sm font-normal "
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
          color="primary"
          onPress={() => sendInvites()}
        >
          Aggiungi
        </Button>
      </div>
    </div>
  );
}
