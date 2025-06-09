"use client";
import { MdMoreVert } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaRegCopy } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { RiSettings4Fill } from "react-icons/ri";
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
  DropdownSection,
  DropdownItem,
} from "@heroui/react";
import { useState } from "react";
import { deleteSetList } from "./deleteSetlistAction";
import Link from "next/link";

export default function MoreDropdowSetlist({
  setlistId,
}: {
  setlistId: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [copied, setCopied] = useState(false);
  const deleteSetlist = (event: any) => {
    deleteSetList(setlistId);
  };
  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="flat" isIconOnly>
            <RiSettings4Fill size={25} color="#000000" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Dropdown menu with shortcut" variant="flat">
          <DropdownItem
            startContent={<MdModeEdit />}
            key="new"
            className="text-center"
            as={Link}
            href={`/setlist/${setlistId}/update`}
          >
            Aggiorna
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
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Elimina Evento
              </ModalHeader>
              <ModalBody>
                <p>
                  <span className="underline">
                    Sei sicuro di voler eliminare questo evento?
                  </span>{" "}
                  Eliminerai tutti i dati relativi a questo evento. Se sì clicca
                  su
                  <strong>"Elimina"</strong> altrimenti clicca su cancella.
                </p>
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
