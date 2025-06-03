"use client";
import { Button, Input } from "@heroui/react";
import { useForm } from "react-hook-form";

import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { completeAccountAction } from "./completeAccountAction";
import { basicUserData } from "@/utils/types/userData";
import { Alert } from "@heroui/react";
import Link from "next/link";
import { FaLock } from "react-icons/fa6";

export default function CompleteAccount({
  churchList,
  userData,
}: {
  churchList: Array<{ id: string; churchName: string }>;
  userData: basicUserData;
}) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<basicUserData>({
    // No resolver needed, only TypeScript type
  });

  const convertData = async (data: basicUserData) => {
    console.log(data);
    let updatedData: basicUserData = data;

    if (data.church_name) {
      const index = churchList.findIndex(
        (church) => church.churchName === data.church_name
      );
      updatedData.church_id = churchList[index].id;
    }
    completeAccountAction(updatedData);
  };
  console.log("userData");
  console.log(userData);

  return (
    <>
      <form onSubmit={handleSubmit(convertData)}>
        <h1 className="text-2xl font-medium">Completa il tuo Profilo</h1>

        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Link href="/protected/dashboard/account/updateImage">Aggiorna immagine profilo.</Link>
          <div className="flex gap-4 items-center">
            <Input
              {...register("name")}
              label="Nome"
              variant="bordered"
              size="sm"
              defaultValue={userData.name}
            />
            <Input
              {...register("lastname")}
              label="Cognome"
              variant="bordered"
              size="sm"
              defaultValue={userData.lastname}
            />
          </div>
          {userData.church_id && (
            <p>
              La mia chiesa:<strong>{userData.church_name}</strong>
            </p>
          )}
          {!userData.pending_church_confirmation && !userData.church_id && (
            <>
              <Autocomplete
                defaultSelectedKey={userData.church_id}
                variant="bordered"
                placeholder="La mia chiesa..."
                {...register("church_name")}
                label="Seleziona la tua chiesa"
              >
                {churchList.map(
                  (church: { id: string; churchName: string }) => (
                    <AutocompleteItem key={church.id} id={church.id}>
                      {church.churchName}
                    </AutocompleteItem>
                  )
                )}
              </Autocomplete>
              <small>
                Se la tua chiesa non è nella lista{" "}
                <Link
                  href="/churches/addChurch"
                  className="text-blue-600 underline font-bold"
                >
                  Clicca qui
                </Link>
              </small>
            </>
          )}
          <Input
            label="Email"
            variant="bordered"
            size="sm"
            disabled
            placeholder={userData.email}
            endContent={
              <FaLock className="text-l text-default-500 pointer-events-none flex-shrink-0 my-auto" />
            }
          />

          <Input
            {...register("id")}
            name="id"
            label="id"
            className="hidden"
            value={userData.id}
          />

          <Button
            className="mt-3"
            color="primary"
            variant="shadow"
            type="submit"
            disabled={isSubmitting}
          >
            Aggiorna profilo
          </Button>
          {userData.pending_church_confirmation && (
            <Alert
              color="primary"
              description="Attendi che i responsabili della tua chiesa confermino il tuo account."
              title="In attesa di conferma"
            />
          )}
        </div>
      </form>
    </>
  );
}
