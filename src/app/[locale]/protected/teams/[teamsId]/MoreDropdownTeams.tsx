"use client";
import { MdMoreVert } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaAsterisk, FaRegCopy } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Checkbox,
  Input,
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
import { teamData, teamFormValues } from "@/utils/types/types";
import { useForm } from "react-hook-form";
import { createTeam } from "../create-team/createTeamAction";
import { updateTeamAction } from "./updateTeamAction";

export default function MoreDropdownTeams({
  teamsId,
  teamName,
  isWorship,
  setDefineLeaders,
  setRefetchTrigger,
}: {
  teamsId: string;
  isWorship: boolean;
  teamName: string;
  setRefetchTrigger: Dispatch<React.SetStateAction<boolean>>;
  setDefineLeaders: Dispatch<React.SetStateAction<boolean>>;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: editIsOpen,
    onOpen: editOnOpen,
    onOpenChange: editOnOpenChange,
  } = useDisclosure();
  const {
    handleSubmit,
    register,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<teamFormValues>({
    defaultValues: {
      is_worship: isWorship,
      team_name: teamName,
    },
  });

  const deleteTeam = async () => {
    await deleteTeamAction(teamsId);
  };

  const convertData = async () => {
    const watchAllFields = watch(); // when pass nothing as argument, you are watching everything
    const churchTeamUpdated: teamData = {
      id: teamsId,
      team_name: watchAllFields.team_name,
      is_worship: watchAllFields.is_worship,
    };
    console.log("churchTeamUpdated", churchTeamUpdated);
    const response = await updateTeamAction(churchTeamUpdated);
    setRefetchTrigger((prev) => !prev);
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
            key="edit"
            onPress={editOnOpen}
          >
            Modifica
          </DropdownItem>
          <DropdownItem
            startContent={<FaAsterisk />}
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

      <Modal
        isOpen={editIsOpen}
        onOpenChange={editOnOpenChange}
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h4>Aggiorna Team</h4>
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={handleSubmit(() => {
                    convertData();
                    onClose();
                  })}
                >
                  <div className="flex flex-col gap-2 [&>input]:mb-3">
                    <Input
                      {...register("team_name")}
                      label="Nome Team"
                      variant="underlined"
                      labelPlacement="outside"
                      className="title-input"
                      required
                      placeholder="Worship Team"
                    />
                  </div>
                  <Checkbox {...register("is_worship")}>
                    <p>
                      Team di adorazione{": "}
                      <small>
                        Seleziona questa opzione se il team che stai creando è
                        dedicato all'adorazione. I membri di questo team avranno
                        accesso a funzionalità dedicate.
                      </small>
                    </p>
                  </Checkbox>

                  <div className="flex-row flex gap-4 py-5">
                    <Button
                      fullWidth
                      variant="light"
                      color="danger"
                      onPress={onClose}
                    >
                      Annulla
                    </Button>
                    <Button
                      fullWidth
                      color="primary"
                      variant="shadow"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Aggiorna Team
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
