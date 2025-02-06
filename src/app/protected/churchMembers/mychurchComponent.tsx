"use client";
import { redirect } from "next/navigation";
import { basicUserData } from "@/utils/types/userData";
import { profileT, Team } from "@/utils/types/types";
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
import { useState } from "react";
import TeamsTableN from "./TeamsTableN";
import { teamsVariable } from "./teamsType";
import { FormProvider, useForm } from "react-hook-form";

export default function MyChurch({
  userData,
  profiles,
}: {
  userData: basicUserData;
  profiles: profileT[];
}) {
  const methods = useForm();
  let accountCompleted = false;
  if ((userData.name && userData.lastname) || userData.church_id) {
    accountCompleted = true;
  }
  if (userData) {
    const onSubmit = (data:any) => console.log(data);

    return (
      <div className="flex flex-row w-full gap-12">
        <div className="container-sub">
          <h4> New Life Teams</h4>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>             
             <TeamsTableN profiles={profiles} />;
              <Button type="submit" >Invia</Button>
            </form>
          </FormProvider>

          
        </div>
      </div>
    );
  } else {
    redirect("/login");
  }
}
