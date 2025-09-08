"use client";

import { useUserStore } from "@/store/useUserStore";
import { useState } from "react";
import { AiOutlineLink } from "react-icons/ai";

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
import CreateMultipleEventsForm from "@/app/protected/church/personalize/addmultipleevents/UpdateMultipleEventsForm";

import Link from "next/link";
import { HeaderCL } from "@/app/components/header-comp";
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
import { MdOutlineLibraryMusic } from "react-icons/md";

type Category = "personalizzazione" | "musica";

const categoryLabels: Record<Category, string> = {
  personalizzazione: "Personalizzazione",
  musica: "Musica",
};
interface ChurchSettingsProps {
  userData: {
    church_logo: string | null;
  };
  updateLogo: boolean;
  setUpdateLogo: (value: boolean) => void;
}
export default function PersonalizeChurchComponent() {
  const { userData } = useUserStore();
  const [updateLogo, setUpdateLogo] = useState(false);
  const {
    isOpen: isOpenMultipleEventsModal,
    onOpen: onOpenMultipleEventsModal,
    onOpenChange: onOpenChangeMultipleEventsModal,
  } = useDisclosure();
  const [selectedCategory, setSelectedCategory] =
    useState<Category>("personalizzazione");

  return (
    <div className="container-sub">
      <HeaderCL icon={LuChurch} title="Personalizza Chiesa" />

      <div>
        <div className="max-w-4xl mx-auto py-4 space-y-6">
          {/* Pulsanti categoria */}

          {/* Sezioni filtrate */}
          <div className="space-y-2">
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
            <SectionCard
              title="Lista Canzoni"
              icon={MdOutlineLibraryMusic}
              description="Visualizza e modifica tutte le canzoni caricate dalla tua chiesa"
              href="/songs"
            />
            <SectionCard
              icon={LuLayoutTemplate}
              title="Template Scalette"
              description="Crea e modifica modelli predefiniti per le tue scalette."
              href="/protected/church/personalize/schedule-template"
            />
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
    <div className=" p-2 border-b-1 last:border-b-0">
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
