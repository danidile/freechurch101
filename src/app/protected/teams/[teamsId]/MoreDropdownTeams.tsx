"use client";
import { MdMoreVert } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaRegCopy } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  Button,
  DropdownItem,
  Link,
} from "@heroui/react";
import { Dispatch, useState } from "react";
import { deleteTeamAction } from "./deleteTeamAction";

export default function MoreDropdownTeams({
  teamsId,
  setDefineLeaders,
}: {
  teamsId: string;
  setDefineLeaders: Dispatch<React.SetStateAction<boolean>>;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const deleteTeam = async () => {
    await deleteTeamAction(teamsId);
  };
  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered" className="mr-0" isIconOnly>
            <MdMoreVert className="text-2xl" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Dropdown menu with shortcut" variant="flat">
          <DropdownItem
            startContent={<MdModeEdit />}
            key="new"
            onPress={() => setDefineLeaders(true)}
          >
            Aggiorna Ruoli
          </DropdownItem>

          <DropdownItem
            startContent={<MdDelete />}
            variant="flat"
            onPress={onOpen}
            key="delete"
            className="text-danger"
            color="danger"
          >
            Elimina
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-red-600">
                ⚠️ Elimina Team
              </ModalHeader>
              <ModalBody>
                <p className="text-sm text-gray-700">
                  Sei sicuro di voler eliminare questo team? <br />
                  <strong className="text-red-600">
                    Questa azione è irreversibile
                  </strong>{" "}
                  e comporterà la perdita di tutti i dati associati a questo
                  team.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Annulla
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    onClose();
                    deleteTeam();
                  }}
                >
                  Elimina definitivamente
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
