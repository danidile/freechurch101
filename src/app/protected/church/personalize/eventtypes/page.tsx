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
import { motion, AnimatePresence } from "framer-motion";

import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import updateEventTypesAction from "./updateEventTypesAction";
import { defaultEventTypes } from "@/constants";
import { eventType } from "@/utils/types/types";
import { useChurchStore } from "@/store/useChurchStore";
import addEventTypesAction from "./addEventTypesAction";
import removeEventTypesAction from "./removeEventTypesAction";
import { HeaderCL } from "@/app/components/header-comp";
import { LuBox, LuCalendar1 } from "react-icons/lu";

export default function PersonalizeEventsModal() {
  const { fetchChurchData, eventTypes, loadingChurchData } = useChurchStore();
  const [personalizedEventTypes, setPersonalizedEventTypes] =
    useState<eventType[]>(eventTypes);
  const { userData, loading } = useUserStore();

  const [refetchTrigger, setRefetchTrigger] = useState(false);
  const [hasBeenEdited, setHasBeenEdited] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!loadingChurchData) {
      setPersonalizedEventTypes(eventTypes);
      console.log("eventTypes", eventTypes);
    }
  }, [loadingChurchData, eventTypes]);

  const handleInputChange = (key: string, value: string) => {
    setHasBeenEdited(true);
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
      if (!response.success) {
        setErrorMessage("Errore durante la creazione del tipo evento");
      } else {
        setSuccessMessage("Tipo evento creato con successo");
      }
    }
    if (deleted.length >= 1) {
      const response = await removeEventTypesAction(
        deleted,
        userData.church_id
      );
      if (!response.success) {
        setErrorMessage("Errore durante l'eliminazione del tipo evento");
      } else {
        setSuccessMessage("Tipo evento eliminato con successo");
      }
    }
    if (edited.length >= 1) {
      const response = await updateEventTypesAction(edited, userData.church_id);
      if (!response.success) {
        setErrorMessage("Errore durante l'aggiornamento del tipo evento");
      } else {
        setSuccessMessage("Tipo evento aggiornato con successo");
      }
    }

    setRefetchTrigger(!refetchTrigger);
    // fetchChurchData(userData.church_id, userData.role);
  };
  return (
    <div className="max-w-2xl w-full p-4 rounded-lg mx-auto">
      <HeaderCL icon={LuCalendar1} title="Personalizza tipi evento" /> <h2></h2>
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="mt-4 rounded-lg bg-green-50 p-4 border border-green-600 text-green-800 text-sm"
          >
            ✅ {successMessage}
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="mt-4 rounded-lg bg-red-50 p-4 border border-red-600 text-red-800 text-sm"
          >
            ❌ {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>
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
      {hasBeenEdited && (
        <Button
          color="primary"
          onPress={() => {
            saveEventTypes();
          }}
        >
          Salva
        </Button>
      )}
    </div>
  );
}
