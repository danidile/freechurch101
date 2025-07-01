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
  Link,
} from "@heroui/react";

import ImageUploader from "../../dashboard/account/updateImage/ImageUploader";
import CreateMultipleEventsForm from "@/app/setlist/addMultipleEvents/UpdateMultipleEventsForm";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import updateEventTypesAction from "./updateEventTypesAction";
import { defaultEventTypes } from "@/constants";
import { eventType } from "@/utils/types/types";
import { getpersonalizedEventTypesByChurch } from "@/hooks/GET/getpersonalizedEventTypesByChurch";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import sendInvitesAction from "./sendInvitesAction";
import sendInviteEmail from "./sendInviteEmail";
import InviteUsersModalComponent from "../invitemembers/page";
type Member = {
  name: string;
  lastname: string;
  email: string;
};
export default function PersonalizeChurchComponent() {
  const [personalizedEventTypes, setPersonalizedEventTypes] = useState<
    eventType[]
  >([]);
  const { userData, loading } = useUserStore();
  const [updateLogo, setUpdateLogo] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(false);
  const {
    isOpen: isOpenMultipleEventsModal,
    onOpen: onOpenMultipleEventsModal,
    onOpenChange: onOpenChangeMultipleEventsModal,
  } = useDisclosure();
  const {
    isOpen: isOpenCustomizeTypesModal,
    onOpen: onOpenCustomizeTypesModal,
    onOpenChange: onOpenChangeCustomizeTypesModal,
  } = useDisclosure();
  const {
    isOpen: isOpenInviteModal,
    onOpen: onOpenInviteModal,
    onOpenChange: onOpenChangeInviteModal,
  } = useDisclosure();
  const [members, setMembers] = useState<Member[]>([
    { name: "", lastname: "", email: "" },
  ]);
  useEffect(() => {
    if (!loading && userData.loggedIn) {
      getpersonalizedEventTypesByChurch(userData.church_id).then(
        (fetchedEventTypes) => {
          console.log("fetchedEventTypes", fetchedEventTypes);
          setPersonalizedEventTypes(fetchedEventTypes);
        }
      );
    }
  }, [loading, userData, refetchTrigger]);
  const addMember = () => {
    setMembers([...members, { name: "", lastname: "", email: "" }]);
  };

  const handleMembersInputChange = (
    index: number,
    field: keyof Member,
    value: string
  ) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  const handleInputChange = (key: string, value: string) => {
    setPersonalizedEventTypes((prev) => {
      // Check if the key exists
      const existingIndex = prev.findIndex((item) => item.key === key);

      if (existingIndex !== -1) {
        // Update existing
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], alt: value };
        return updated;
      } else {
        // Add new
        return [...prev, { key, label: value }];
      }
    });
  };

  const saveEventTypes = () => {
    console.log(personalizedEventTypes);
    updateEventTypesAction(personalizedEventTypes, userData.church_id);
    setRefetchTrigger(!refetchTrigger);
  };
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
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            <tr>
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
            <tr>
              <td>
                <p>Personalizza i tipi di evento per la tua chiesa:</p>
                <small>
                  Se non li personalizzi rimarranno comunque disponibili e
                  selezionabili nella fase di creazione degli eventi.
                </small>
              </td>
              <td>
                <Button
                  color="primary"
                  size="md"
                  variant="light"
                  onPress={onOpenCustomizeTypesModal}
                >
                  Personalizza
                </Button>
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
            <tr>
              <td>
                <p>Gestisci canzoni e accordi personalizzati</p>
              </td>
              <td>
                <Button
                  color="primary"
                  size="md"
                  variant="light"
                  as={Link}
                  href="/protected/churchsongs"
                >
                  Lista Canzoni
                </Button>
              </td>
            </tr>
            <tr>
              <td>
                <p>Importa canzoni da Planning Center</p>
              </td>
              <td>
                <Button
                  color="primary"
                  size="md"
                  variant="light"
                  as={Link}
                  href="/importsongs"
                >
                  Importa Canzoni
                </Button>
              </td>
            </tr>
            <tr>
              <td>
                <p>Definisci i tag da assegnare alle canzoni</p>
              </td>
              <td>
                <Button color="primary" size="md" variant="light" disabled>
                  Modifica Tag
                </Button>
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
            <tr>
              <td>
                <p>Invita nuovi membri con un link dedicato</p>
              </td>
              <td>
                <Button
                  color="primary"
                  size="md"
                  variant="light"
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
      <Modal
        className="max-h-[700px]"
        placement="center"
        scrollBehavior="inside"
        size="lg"
        isOpen={isOpenCustomizeTypesModal}
        onOpenChange={onOpenChangeCustomizeTypesModal}
      >
        <ModalContent>
          {(onCloseCustomizeTypesModal) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Personalizza tipi evento
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-3">
                  {defaultEventTypes.map((eventTypeKey) => {
                    const matchingEvent = personalizedEventTypes.find(
                      (item) => item.key === eventTypeKey.key
                    );
                    const inputValue = matchingEvent
                      ? matchingEvent.alt || ""
                      : "";

                    return (
                      <div
                        key={eventTypeKey.key}
                        className="grid grid-cols-3 auto-rows-max gap-0 items-center"
                        style={{ gridTemplateColumns: "45% 10% 45%" }}
                      >
                        <p>{eventTypeKey.label}</p>
                        <div className="text-center w-full">
                          <MdKeyboardDoubleArrowRight />
                        </div>
                        <Input
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
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onCloseCustomizeTypesModal}
                >
                  Annulla
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    saveEventTypes();
                    onCloseCustomizeTypesModal();
                  }}
                >
                  Salva
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
