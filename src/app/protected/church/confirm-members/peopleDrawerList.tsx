"use client";
import { pendingRequestsT, profileT } from "@/utils/types/types";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Link,
  Input,
} from "@heroui/react";
import { basicUserData } from "@/utils/types/userData";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { RadioGroup, Radio } from "@heroui/react";
import { confirmBelongingAction } from "./confirmBelongingAction";
import { confirmAndUpdateTempUserAction } from "./confirmAndUpdateTempUserAction";
import { useForm, Controller } from "react-hook-form";

export default function PeopleDrawerList({
  profile,
  userData,
  tempProfiles,
}: {
  tempProfiles: profileT[];
  profile: pendingRequestsT;
  userData: basicUserData;
}) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { isSubmitting },
  } = useForm();

  const confirmBelonging = (profileId: string) => {
    console.log("profileId");
    console.log(profileId);
    // confirmBelongingAction(profileId);
  };
  const confirmAndUpdateTempUser = () => {
    console.log("profileId");
    const watched = watch();
    console.log("watched.profileId");
    console.log(watched.profileId);
    console.log("watched.tempProfileId");
    console.log(watched.tempProfileId);
    // confirmAndUpdateTempUserAction(watched.profileId, watched.tempProfileId);
  };
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex flex-row w-full gap-12" key={profile.id}>
      <Link className="people-link" key={profile.id}>
        <div className="people-list" key={profile.id}>
          <p key={profile.profile.id}>
            {profile.profile.name}
            <br />
            <small>{profile.profile.email}</small>
          </p>
          <span className="material-symbols-outlined">
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered">Clicca qui</Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Dynamic Actions">
                <DropdownItem
                  color="primary"
                  key="confirm"
                  className="text-center"
                  onPress={() => confirmBelonging(profile.profile.id)}
                >
                  Conferma
                </DropdownItem>
                <DropdownItem
                  color="primary"
                  key="confirm"
                  onPress={onOpen}
                  className="text-center"
                >
                  Collega a profilo temporaneo
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  className="text-center text-danger"
                  color="danger"
                >
                  Nega
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </span>
        </div>
      </Link>
      <Modal placement="center" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Profilo Temporaneo?
              </ModalHeader>
              <ModalBody>
                <p>
                  Avevi creato un profilo temporaneo per questo utente? Se sì
                  selezionalo per passare tutte le informazioni del profilo
                  temporaneo a questo utente.
                </p>
                <p>
                  <b>Lista profili temporanei</b>
                </p>
                <form onSubmit={handleSubmit(confirmAndUpdateTempUser)}>
                  <Input
                    {...register("profileId")}
                    className="hidden"
                    value={profile.profile.id}
                  ></Input>
                  <Controller
                    name="tempProfileId"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup {...field}>
                        {tempProfiles.map((profile) => (
                          <Radio key={profile.id} value={String(profile.id)}>
                            {profile.name} {profile.lastname}
                          </Radio>
                        ))}
                      </RadioGroup>
                    )}
                  />

                  <Button
                    color="primary"
                    variant="shadow"
                    type="submit"
                    fullWidth
                    className="mt-8 mb-4"
                    disabled={isSubmitting}
                  >
                    Aggiorna profilo temporaneo
                  </Button>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
