"use client";
import { redirect } from "next/navigation";
import { basicUserData } from "@/utils/types/userData";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { eventPlanner } from "@/utils/types/types";
import { useState } from "react";
import Planner from "./Planner";
import { FormProvider, useForm } from "react-hook-form";
import { eventPlannerVariable } from "./teamsType";
export default function MyChurch({
  userData,
  eventPlan,
}: {
  userData: basicUserData;
  eventPlan: eventPlanner[];
}) {
  const methods = useForm();

  const { register, reset } = methods;

  const [teams, setTeams] = useState<eventPlanner[]>(eventPlan);

  const addTeam = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    const teamName = data.teamName as string; // Explicit cast to string

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
    const onSubmit = (data: any) => console.log(data);

    return (
      <div className="flex flex-row w-full gap-12">
        <div className="container-sub">
          <h4> New Life Planner</h4>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              {eventPlannerVariable.teams.map((team: any, index: number) => {
                console.log("Index" + index);
                return <Planner teamId={index} team={team} />;
              })}
              <Button type="submit">Invia</Button>
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
