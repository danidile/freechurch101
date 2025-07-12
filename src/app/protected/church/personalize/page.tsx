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

export default function PersonalizeChurchComponent() {
  const { userData, loading } = useUserStore();
  const [updateLogo, setUpdateLogo] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(false);
  const {
    isOpen: isOpenMultipleEventsModal,
    onOpen: onOpenMultipleEventsModal,
    onOpenChange: onOpenChangeMultipleEventsModal,
  } = useDisclosure();

  return (
    <div className="p-0 sm:p-5">
      <div className="w-full">
        <h5 className="font-bold ml-3 my-5">{userData.church_name}</h5>
      </div>
      <div className="table-container">
        <table className="settings-table">
          <thead>
            <tr>
              <th>Impostazioni</th>
              <th className="text-center hidden lg:table-cell">Azioni</th>
            </tr>
          </thead>
          <tbody>
            <tr className="flex flex-col w-full lg:table-row lg:w-auto">
              <td>
                <p>Personalizza il logo della chiesa:</p>
              </td>
              <td>
                {userData.church_logo && (
                  <>
                    {!updateLogo && (
                      <>
                        <div
                          className="max-w-[225px] w-full max-h-[225px] h-full mx-auto my-4"
                          style={{
                            backgroundImage: `url(https://kadorwmjhklzakafowpu.supabase.co/storage/v1/object/public/churchlogo/${userData.church_logo})`,
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                          }}
                        >
                          <div
                            onClick={() => setUpdateLogo(true)}
                            className="bg-[#f8f8f7] w-[250px] h-[80px] flex flex-col justify-center items-center opacity-0 hover:opacity-90 transition-opacity duration-300"
                          >
                            Aggiorna
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
                {(!userData.church_logo || updateLogo) && (
                  <>
                    <ImageUploader type="churchlogo" />
                  </>
                )}
              </td>
            </tr>
            
            <tr className="flex flex-col w-full lg:table-row lg:w-auto">
              <td>
                <p>Organizza i Team con ruoli e permessi</p>
              </td>
              <td className="flex flex-col justify-center items-center">
                <Link
                  href="/protected/teams"
                  className="flex-row flex gap-1 items-center"
                >
                  <AiOutlineLink size={14} />
                  Gestisci
                </Link>
              </td>
            </tr>

            <tr className="flex flex-col w-full lg:table-row lg:w-auto">
              <td>
                <p>Organizza gli spazi della tua chiesa:</p>
              </td>
              <td className="flex flex-col justify-center items-center">
                <Link
                  href="/protected/church/personalize/rooms"
                  className="flex-row flex gap-1 items-center"
                >
                  <AiOutlineLink size={14} />
                  Personalizza
                </Link>
              </td>
            </tr>
            <tr className="flex flex-col w-full lg:table-row lg:w-auto">
              <td>
                <p>Personalizza i tipi di evento per la tua chiesa:</p>
                <small>
                  Se non li personalizzi rimarranno comunque disponibili e
                  selezionabili nella fase di creazione degli eventi.
                </small>
              </td>
              <td className="flex flex-col justify-center items-center">
                <Link
                  className="flex-row flex gap-1 items-center"
                  href="/protected/church/personalize/eventtypes
                "
                >
                  <AiOutlineLink size={14} />
                  Personalizza
                </Link>
              </td>
            </tr>
            <tr className="flex flex-col w-full lg:table-row lg:w-auto">
              <td>
                <p>Crea e pianifica eventi settimanali o mensili</p>
              </td>
              <td className="flex flex-col justify-center items-center">
                <Link
                  className="flex-row flex gap-1 items-center"
                  href="/protected/church/personalize/addmultipleevents"
                >
                  <AiOutlineLink size={14} />
                  Personalizza
                </Link>
              </td>
            </tr>
            {/* <tr>
              <td>Imposta notifiche automatiche via email o app</td>
              <td>
                <button className="settings-action">Configura</button>
              </td>
            </tr> */}
            <tr className="flex flex-col w-full lg:table-row lg:w-auto">
              <td>
                <p>Gestisci canzoni e accordi personalizzati</p>
              </td>
              <td className="flex flex-col justify-center items-center">
                <Link
                  className="flex-row flex gap-1 items-center"
                  href="/protected/churchsongs"
                >
                  {" "}
                  <AiOutlineLink size={14} />
                  Lista Canzoni
                </Link>
              </td>
            </tr>
            <tr className="flex flex-col w-full lg:table-row lg:w-auto">
              <td>
                <p>Importa canzoni da Planning Center</p>
              </td>
              <td className="flex flex-col justify-center items-center">
                <Link
                  className="flex-row flex gap-1 items-center"
                  href="/importsongs"
                >
                  {" "}
                  <AiOutlineLink size={14} />
                  Importa Canzoni
                </Link>
              </td>
            </tr>
            <tr className="flex flex-col w-full lg:table-row lg:w-auto">
              <td>
                <p>Definisci i tag da assegnare alle canzoni</p>
              </td>
              <td className="flex flex-col justify-center items-center">
                <Link
                  className="flex-row flex gap-1 items-center"
                  href="/protected/church/personalize/tags"
                >
                  <AiOutlineLink size={14} />
                  Personalizza
                </Link>
              </td>
            </tr>

            <tr className="flex flex-col w-full lg:table-row lg:w-auto">
              <td>
                <p>Invita nuovi membri con un link dedicato</p>
              </td>
              <td className="flex flex-col justify-center items-center">
                <Link
                  className="flex-row flex gap-1 items-center"
                  href="/protected/church/invitemembers"
                >
                  {" "}
                  <AiOutlineLink size={14} />
                  Invita
                </Link>
              </td>
            </tr>
            {/* <tr>
              <td>Imposta approvazioni per le scalette</td>
              <td>
                <button className="settings-action">Imposta</button>
              </td>
            </tr> */}
            {/* <tr>
              <td>Visualizza statistiche su eventi e partecipazione</td>
              <td>
                <button className="settings-action">Visualizza</button>
              </td>
            </tr> */}
            {/* <tr>
              <td>
                <p>Archivia eventi passati e setlist precedenti</p>
              </td>
              <td>
                <Button color="primary" size="md" variant="light" disabled>
                  Apri archivio
                </Button>
              </td>
            </tr> */}
          </tbody>
        </table>
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
