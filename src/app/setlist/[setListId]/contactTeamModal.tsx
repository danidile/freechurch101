"use client";
import { MdEditNote, MdMoreVert } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaRegCopy, FaWhatsapp } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { RiSettings4Fill } from "react-icons/ri";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableCell,
  TableRow,
  Chip,
} from "@heroui/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  Button,
  DropdownSection,
  DropdownItem,
} from "@heroui/react";
import { useState } from "react";
import { deleteSetList } from "./deleteSetlistAction";
import Link from "next/link";
import { basicUserData } from "@/utils/types/userData";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { IoIosSend } from "react-icons/io";
import { ChipColor, ChurchMemberByTeam } from "@/utils/types/types";
import { BsThreeDotsVertical } from "react-icons/bs";
import { PiTrash } from "react-icons/pi";
import { IoMailOutline } from "react-icons/io5";

export default function ContactTeamModal({
  team,
  userData,
}: {
  team: [string, ChurchMemberByTeam[]];
  userData: basicUserData;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const deleteSetlist = (event: any) => {
    // deleteSetList(setlistId);
    console.log("deleteSetlist");
  };
  const statusColorMap: Record<string, ChipColor> = {
    pending: "warning",
    confirmed: "success",
    denied: "danger",
  };
  const message = `Hi , I want to inquire about my order  The product is: Could you please provide more details? Thanks!`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/3498366324?text=${encodedMessage}`;

  return (
    <>
      <Button
        onPress={onOpen}
        variant="flat"
        color="primary"
        isIconOnly
        className="mr-0"
      >
        <IoIosSend size={25} />
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Contatta Team
              </ModalHeader>
              <ModalBody>
                <div className="team-show">
                  <Table
                    aria-label="Example table with dynamic content"
                    topContent={
                      <div className="flex flex-row justify-between">
                        <h6 className="font-bold">{team[0]}</h6>
                      </div>
                    }
                  >
                    <TableHeader>
                      <TableColumn>Nome</TableColumn>
                      <TableColumn>Stato</TableColumn>
                      <TableColumn className="text-center">Email</TableColumn>
                      <TableColumn className="text-center">
                        Messaggio
                      </TableColumn>
                    </TableHeader>
                    <TableBody items={team[1]}>
                      {(item) => {
                        const colorChip: ChipColor =
                          statusColorMap[item.status] ?? "default";
                        return (
                          <TableRow key={item.profile}>
                            <TableCell>
                              <div className="flex flex-row gap-2 items-center ">
                                {item.name} {item.lastname}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Chip
                                className="capitalize"
                                color={colorChip}
                                size="sm"
                                variant="flat"
                              >
                                {item.status === "pending" && <>In attesa</>}
                                {item.status === "confirmed" && <>Confermato</>}
                                {item.status === "denied" && <>Rifiutato</>}
                              </Chip>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="w-ful flex flex-row justify-center">
                                <IoMailOutline size={24} />
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="w-ful flex flex-row justify-center">
                                <a
                                  href={whatsappURL}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="whatsapp-button"
                                >
                                  <FaWhatsapp size={24} />
                                </a>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      }}
                    </TableBody>
                  </Table>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button fullWidth color="primary" onPress={onClose}>
                  Cancella
                </Button>
                <Button fullWidth color="danger" onPress={deleteSetlist}>
                  Elimina
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
