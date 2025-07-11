"use client";

import { useUserStore } from "@/store/useUserStore";
import { useState } from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Link,
} from "@heroui/react";

import ImageUploader from "../../dashboard/account/updateImage/ImageUploader";
import CreateMultipleEventsForm from "@/app/setlist/addMultipleEvents/UpdateMultipleEventsForm";

import PersonalizeEventsModal from "./PersonalizeEventsModal";
import PersonalizeSongsTagsModal from "./songsTagsModal";

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
            {/* <tr>
              <td>Gestisci team</td>
              <td>
                <button className="settings-action">Vai</button>
              </td>
            </tr> */}
            {/* <tr>
              <td>Organizza i membri con ruoli e permessi</td>
              <td>
                <button className="settings-action">Gestisci</button>
              </td>
            </tr> */}
            <tr className="flex flex-col w-full lg:table-row lg:w-auto">
              <td>
                <p>Personalizza i tipi di evento per la tua chiesa:</p>
                <small>
                  Se non li personalizzi rimarranno comunque disponibili e
                  selezionabili nella fase di creazione degli eventi.
                </small>
              </td>
              <td className="flex flex-col justify-center items-center">
                <PersonalizeEventsModal />
              </td>
            </tr>
            {/* <tr>
              <td>
                <p>Crea e pianifica eventi settimanali o mensili</p>
              </td>
              <td>
                <Button
                  color="primary"
                  size="md"
                  variant="light"
                  onPress={onOpenMultipleEventsModal}
                >
                  Aggiungi evento
                </Button>
              </td>
            </tr> */}
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
                <Button
                  color="primary"
                  size="md"
                  variant="solid"
                  as={Link}
                  href="/protected/churchsongs"
                >
                  Lista Canzoni
                </Button>
              </td>
            </tr>
            <tr className="flex flex-col w-full lg:table-row lg:w-auto">
              <td>
                <p>Importa canzoni da Planning Center</p>
              </td>
              <td className="flex flex-col justify-center items-center">
                <Button
                  color="primary"
                  size="md"
                  variant="solid"
                  as={Link}
                  href="/importsongs"
                >
                  Importa Canzoni
                </Button>
              </td>
            </tr>
            <tr className="flex flex-col w-full lg:table-row lg:w-auto">
              <td>
                <p>Definisci i tag da assegnare alle canzoni</p>
              </td>
              <td className="flex flex-col justify-center items-center">
                <PersonalizeSongsTagsModal />
              </td>
            </tr>
            {/* <tr>
              <td>Configura le sale utilizzate nella tua chiesa</td>
              <td>
                <button className="settings-action">Configura</button>
              </td>
            </tr> */}
            {/* <tr>
              <td>Personalizza la pagina pubblica della tua chiesa</td>
              <td>
                <button className="settings-action">Modifica</button>
              </td>
            </tr> */}
            <tr className="flex flex-col w-full lg:table-row lg:w-auto">
              <td>
                <p>Invita nuovi membri con un link dedicato</p>
              </td>
              <td className="flex flex-col justify-center items-center">
                <Button
                  color="primary"
                  size="md"
                  variant="solid"
                  as={Link}
                  href="/protected/church/invitemembers"
                >
                  Invita
                </Button>
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
