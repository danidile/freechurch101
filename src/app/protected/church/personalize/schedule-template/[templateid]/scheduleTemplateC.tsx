"use client";
import { getSetList } from "@/hooks/GET/getSetList";
import {
  fetchedSchedule,
  scheduleTemplate,
  setListT,
} from "@/utils/types/types";
import { useUserStore } from "@/store/useUserStore";
import { useState, useEffect } from "react";
import { Alert, Link } from "@heroui/react";
import ChurchLabLoader from "@/app/components/churchLabSpinner";
import LoginForm from "@/app/(auth-pages)/login/loginForm";
import { getSetlistSchedule } from "@/hooks/GET/getSetlistSchedule";
import { getSetListTeams } from "@/hooks/GET/getSetListTeams";
import { GroupedMembers } from "@/utils/types/types";
import { getScheduleTemplateById } from "@/hooks/GET/getScheduleTemplateById";
import SetlistSchedule from "@/app/setlist/[setListId]/setlistScheduleC";
import CDropdown from "@/app/components/CDropdown";
import { FaPlus } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
} from "@heroui/react";
import { deleteScheduleTemplateAction } from "./deleteScheduleTemplateAction";

export default function ScheduleTemplateC({
  templateId,
}: {
  templateId: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [schedule, setSchedule] = useState<fetchedSchedule>(null);
  // Fetch all setlist data
  useEffect(() => {
    if (templateId) {
      const fetchTemplate = async () => {
        const fetchedSchedule = await getScheduleTemplateById(templateId);
        setSchedule(fetchedSchedule);
      };

      fetchTemplate();
    }
  }, [templateId]);

  if (!schedule) {
    return <ChurchLabLoader />;
  }
  const dropdownOptions = [
    {
      label: "Aggiorna",
      value: "/protected/dashboard/account/completeAccount",
      href: `/protected/church/personalize/schedule-template/${templateId}/update`,
    },
    {
      label: "Elimina",
      value: "delete",
      color: "danger",
    },
  ];
  const deleteSetlist = () => {
    console.log("delete");
    deleteScheduleTemplateAction(templateId);
  };
  return (
    <div className="container-sub">
      <div className="song-presentation-container">
        <div className="flex flex-row gap-5 items-center">
          <h3>{schedule.name}</h3>
          <CDropdown
            options={dropdownOptions}
            positionOnMobile="right"
            placeholder={
              <span>
                <IoSettingsOutline size={20} />
              </span>
            }
            onSelect={(option) => {
              if (option.value === "delete") {
                onOpen();
              }
            }}
          />
        </div>

        <SetlistSchedule schedule={schedule.schedule} />
      </div>
      <Modal placement="center" isOpen={isOpen} onOpenChange={onOpenChange}>
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
                <Button
                  fullWidth
                  color="danger"
                  onPress={() => {
                    deleteSetlist();
                    onClose();
                  }}
                >
                  Elimina
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
