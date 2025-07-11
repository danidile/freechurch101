"use client";

import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  addToast,
} from "@heroui/react";

import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import updateEventTypesAction from "./updateEventTypesAction";
import { defaultEventTypes } from "@/constants";
import { eventType } from "@/utils/types/types";
import { useChurchStore } from "@/store/useChurchStore";
import addEventTypesAction from "./addEventTypesAction";
import removeEventTypesAction from "./removeEventTypesAction";

export default function PersonalizeEventsModal() {
  const { fetchChurchData, eventTypes, loadingChurchData } = useChurchStore();
  const [personalizedEventTypes, setPersonalizedEventTypes] =
    useState<eventType[]>(eventTypes);
  const { userData, loading } = useUserStore();

  const [refetchTrigger, setRefetchTrigger] = useState(false);

  useEffect(() => {
    if (!loadingChurchData) {
      setPersonalizedEventTypes(eventTypes);
      console.log("eventTypes", eventTypes);
    }
  }, [loadingChurchData, eventTypes]);

  const handleInputChange = (key: string, value: string) => {
    setPersonalizedEventTypes((prev) => {
      // Check if the key exists
      const existingIndex = prev.findIndex((item) => item.key === key);

      if (existingIndex !== -1) {
        // Update existing
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], edited: value };
        return updated;
      } else {
        // Add new
        return [...prev, { key, label: value }];
      }
    });
  };
  const getEventTypeChanges = () => {
    const edited: eventType[] = [];
    const inserted: eventType[] = [];
    const deleted: eventType[] = [];

    personalizedEventTypes.map((eventType: eventType) => {
      if (eventType.alt && eventType.edited === "") {
        deleted.push(eventType);
      }
      if (
        eventType.alt &&
        eventType.edited &&
        eventType.edited !== eventType.label
      ) {
        edited.push(eventType);
      }
      if (!eventType.alt && eventType.edited) {
        inserted.push(eventType);
      }
    });

    return { edited, inserted, deleted };
  };

  const saveEventTypes = async () => {
    const { edited, deleted, inserted } = getEventTypeChanges();

    console.log("📝 Inserted Event Types:", inserted);
    console.log("📝 Edited Event Types:", edited);
    console.log("🗑️ Deleted Event Types (cleared inputs):", deleted);
    if (inserted.length >= 1) {
      const response = await addEventTypesAction(inserted, userData.church_id);
    }
    if (deleted.length >= 1) {
      const response = await removeEventTypesAction(
        deleted,
        userData.church_id
      );
      if (!response.success) {
        addToast({
          title: `Errore durante l'eliminazione del tipo di evento`,
          description: response.error,
          color: "danger",
        });
      }
    }
    if (edited.length >= 1) {
      const response = await updateEventTypesAction(edited, userData.church_id);
    }

    setRefetchTrigger(!refetchTrigger);
    // fetchChurchData(userData.church_id, userData.role);
  };
  return (
    <>
      <h2>Personalizza tipi evento</h2>

      <div className="flex flex-col gap-3 ">
        {defaultEventTypes.map((eventTypeKey) => {
          const matchingEvent = personalizedEventTypes.find(
            (item) => item.key === eventTypeKey.key
          );
          const inputValue = matchingEvent?.edited ?? matchingEvent?.alt ?? "";
          return (
            <div
              key={eventTypeKey.key}
              className="grid grid-cols-3 border-l-3 auto-rows-max gap-0 pl-2 items-center"
              style={{
                gridTemplateColumns: "45% 10% 45%",
                borderLeftColor: matchingEvent.color,
              }}
            >
              <p>{eventTypeKey.label}</p>
              <div className="text-center w-full">
                <MdKeyboardDoubleArrowRight />
              </div>
              <Input
                radius="sm"
                size="sm"
                placeholder={eventTypeKey.placeholder}
                value={inputValue}
                onChange={(e) =>
                  handleInputChange(eventTypeKey.key, e.target.value)
                }
              />
            </div>
          );
        })}
      </div>

      <Button
        color="primary"
        onPress={() => {
          saveEventTypes();
        }}
      >
        Salva
      </Button>
    </>
  );
}
