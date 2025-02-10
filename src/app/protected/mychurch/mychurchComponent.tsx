"use client";
import { redirect } from "next/navigation";
import { basicUserData } from "@/utils/types/userData";
import { Team } from "@/utils/types/types";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@heroui/react";
import { useState } from "react";
import TeamsTableN from "./TeamsTableN";
import { teamsVariable } from "./teamsType";
import { FormProvider, useForm } from "react-hook-form";

export default function MyChurch({
  userData,
  teamMembers,
}: {
  userData: basicUserData;
  teamMembers: Team[];
}) {
  const methods = useForm();

  const { register, reset } = methods;

  const [teams, setTeams] = useState<Team[]>(teamMembers);

  const addTeam = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    const teamName = data.teamName as string; // Explicit cast to string
    let newIndex = teams.length +1;

    let teamId = newIndex.toString();

    if (teamName) {
      setTeams([
        ...teams,
        {
          teamId,
          teamName,
          teamMembers: [], // Initialize as an empty array
        },
      ]);
    }
  };
  const addNewTeam = (event: React.FormEvent<HTMLFormElement>) => {};

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  let accountCompleted = false;
  if ((userData.name && userData.lastname) || userData.church_id) {
    accountCompleted = true;
  }
  if (userData) {
    const onSubmit = (data:any) => console.log(data);

    return (
      <div className="flex flex-row w-full gap-12">
        <div className="dashboard-container">
          <h4> New Life Teams</h4>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              {/* {teams.map((team: any) => {
            return <TeamsTable teamMembers={team} />;
          })} */}
              {teams.map((team: any, index: number) => {
                console.log("Index"+index);
                return <TeamsTableN teamId={index} team={team} />;
              })}
              <Button type="submit" >Invia</Button>
            </form>
          </FormProvider>

          <Button onPress={onOpen}>Aggiungi Team</Button>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    <h5>Nuovo Team</h5>
                  </ModalHeader>
                  <ModalBody>
                    <form
                      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                        addTeam(event);
                        onClose();
                      }}
                    >
                      <Input
                        isRequired
                        name="teamName"
                        label="Inserisci il nome del Team"
                      />
                      <div className="footermodal">
                        <Button
                          color="danger"
                          variant="light"
                          onPress={onClose}
                        >
                          Chiudi
                        </Button>
                        <Button color="primary" type="submit">
                          Aggiungi Team
                        </Button>
                      </div>
                    </form>
                  </ModalBody>
                  <ModalFooter></ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>
    );
  } else {
    redirect("/login");
  }
}
