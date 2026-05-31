"use client";

import { useUserStore } from "@/store/useUserStore";
import { useState } from "react";
import { AiOutlineLink } from "react-icons/ai";
import { Switch } from "@heroui/react";
import { LuUsers } from "react-icons/lu";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

import ImageUploader from "../../dashboard/account/updateImage/ImageUploader";
import CreateMultipleEventsForm from "@/app/[locale]/protected/church/personalize/addmultipleevents/UpdateMultipleEventsForm";
import { updateChurchField } from "./churchSignupsStatusActions";

import { Link } from "@/i18n/navigation";
import {
  LuAtom,
  LuBox,
  LuCalendar1,
  LuChurch,
  LuImport,
  LuLayoutTemplate,
  LuTags,
} from "react-icons/lu";
import { IconType } from "react-icons";
import React from "react";

export default function PersonalizeChurchComponent() {
  const { userData } = useUserStore();
  const [updateLogo, setUpdateLogo] = useState(false);
  const [signupsLoading, setSignupsLoading] = useState(false);
  const handleToggleSignups = async (value: boolean) => {
    setSignupsLoading(true);
    try {
      await updateChurchField(userData.church_id, "accepting_signups", value);
      useUserStore.setState((state) => ({
        userData: { ...state.userData, accepting_signups: value },
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setSignupsLoading(false);
    }
  };
  const {
    isOpen: isOpenMultipleEventsModal,
    onOpen: onOpenMultipleEventsModal,
    onOpenChange: onOpenChangeMultipleEventsModal,
  } = useDisclosure();

  return (
    <div className="container-sub">
      <div>
        <div className="w-full mx-auto py-4 space-y-6">
          {/* Sezioni filtrate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <SectionCard
              icon={LuUsers}
              title="Iscrizioni aperte"
              description="Se attivo, i membri possono iscriversi agli eventi tramite il link pubblico. Se disattivo, il link non funzionerà."
            >
              <Switch
                isSelected={userData.accepting_signups ?? false}
                isDisabled={signupsLoading}
                onValueChange={handleToggleSignups}
                size="sm"
                color="success"
              >
                <span className="text-sm text-gray-600">
                  {userData.accepting_signups
                    ? "Iscrizioni aperte"
                    : "Iscrizioni chiuse"}
                </span>
              </Switch>
              {userData.accepting_signups && (
                <div
                  className="mt-2 flex items-center gap-1 cursor-pointer group"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `https://www.churchlab.it/it/signup/${userData.church_id}`,
                    )
                  }
                >
                  <span className="text-sm text-gray-500 truncate group-hover:text-blue-600 transition">
                    https://www.churchlab.it/it/signup/{userData.church_id}
                  </span>
                  <AiOutlineLink
                    size={14}
                    className="text-gray-400 group-hover:text-blue-600 transition shrink-0"
                  />
                </div>
              )}
            </SectionCard>
            <SectionCard
              title="Tipi di evento"
              icon={LuCalendar1}
              description="Personalizza le categorie di evento in base alla vita della tua chiesa (es. culto, preghiera, prove, ecc.) per rendere il calendario più chiaro e il linguaggio dell’app più vicino a quello che usate ogni giorno.

"
              href="/protected/church/personalize/eventtypes"
            />

            <SectionCard
              title="Stanze della chiesa"
              icon={LuBox}
              description="Aggiungi o modifica gli spazi fisici utilizzati per gli eventi, come l’auditorium principale, aule bambini, sale prove, ecc."
              href="/protected/church/personalize/rooms"
            />
            <SectionCard
              title="Importa da Planning Center"
              icon={LuImport}
              description="Sincronizza facilmente le tue canzoni da Planning Center per evitare l'inserimento manuale e risparmiare tempo."
              href="/importsongs"
            />
            <SectionCard
              icon={LuTags}
              title="Tag delle canzoni"
              description="Crea e gestisci tag per organizzare meglio le canzoni (es. adorazione, celebrazione, lingua, stagione)."
              href="/protected/church/personalize/tags"
            />
            {/* <SectionCard
              title="Lista Canzoni"
              icon={MdOutlineLibraryMusic}
              description="Visualizza e modifica tutte le canzoni caricate dalla tua chiesa"
              href="/songs"
            /> */}
            <SectionCard
              icon={LuLayoutTemplate}
              title="Template Scalette"
              description="Crea e modifica modelli predefiniti per le tue scalette."
              href="/protected/church/personalize/schedule-template"
            />

            <SectionCard
              title="Logo della chiesa"
              icon={LuAtom}
              description="Carica il logo ufficiale della tua chiesa: verrà mostrato in tutta la piattaforma per una presenza visiva coerente e riconoscibile."
            >
              {userData.church_logo && !updateLogo ? (
                <div
                  className="relative mx-auto my-2 w-full max-w-xs h-48 bg-center bg-contain bg-no-repeat group"
                  style={{
                    backgroundImage: `url(https://kadorwmjhklzakafowpu.supabase.co/storage/v1/object/public/churchlogo/${userData.church_logo}?t=${Date.now()})`,
                  }}
                >
                  <button
                    onClick={() => setUpdateLogo(true)}
                    className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    Aggiorna
                  </button>
                </div>
              ) : (
                <ImageUploader closeState={setUpdateLogo} type="churchlogo" />
              )}
            </SectionCard>
          </div>
        </div>
      </div>
      <Modal
        placement="center"
        size="lg"
        isOpen={isOpenMultipleEventsModal}
        onOpenChange={onOpenChangeMultipleEventsModal}
      >
        <ModalContent>
          {(onCloseMultipleEventsModal) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Aggiungi eventi
              </ModalHeader>
              <ModalBody>
                <CreateMultipleEventsForm />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onCloseMultipleEventsModal}
                >
                  Close
                </Button>
                <Button color="primary" onPress={onCloseMultipleEventsModal}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

// 🔹 Componente riutilizzabile per ogni card
interface SectionCardProps {
  title: string;
  description?: string;
  href?: string;
  children?: React.ReactNode;
  icon?: IconType;
}

const SectionCard = ({
  title,
  description,
  href,
  children,
  icon,
}: SectionCardProps) => {
  return (
    <div className="p-2 bg-gray-50 rounded-lg">
      <div className="flex flex-row items-center gap-2">
        {icon && <span>{React.createElement(icon)}</span>}
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      {description && (
        <p className="text-sm text-gray-500 mb-2">{description}</p>
      )}
      {href ? (
        <Link
          href={href}
          className="text-blue-600 inline-flex gap-1 items-center text-sm font-medium mt-1"
        >
          <AiOutlineLink size={14} />
          Vai
        </Link>
      ) : (
        children
      )}
    </div>
  );
};
