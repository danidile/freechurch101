"use client";
import { Button, Input, Link } from "@heroui/react";
import { useForm } from "react-hook-form";

import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { completeAccountAction } from "./completeAccountAction";
import { basicUserData } from "@/utils/types/userData";
import { Alert } from "@heroui/react";

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
    const index = churchList.findIndex(
      (church) => church.churchName === data.church_name
    );
    let updatedData: basicUserData = data;
    updatedData.church_id = churchList[index].id;
    completeAccountAction(updatedData);
  };

  return (
    <>
      {!userData.church_id &&
        !userData.pending_church_confirmation &&
        !userData.name &&
        !userData.lastname && (
          <form onSubmit={handleSubmit(convertData)}>
            <h1 className="text-2xl font-medium">Completa il tuo Profilo</h1>

            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
              <div className="flex gap-4 items-center">
                {!userData.name && (
                  <Input
                    {...register("name")}
                    label="Nome"
                    variant="bordered"
                    size="sm"
                    defaultValue={userData.name}
                  />
                )}
                {!userData.lastname && (
                  <Input
                    {...register("lastname")}
                    label="Cognome"
                    variant="bordered"
                    size="sm"
                    defaultValue={userData.lastname}
                  />
                )}
              </div>
              {!userData.church_id && !userData.pending_church_confirmation && (
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
                        <AutocompleteItem key={church.id} value={church.id}>
                          {church.churchName}
                        </AutocompleteItem>
                      )
                    )}
                  </Autocomplete>
                  <small>
                    Se la tua chiesa non è nella lista{" "}
                    <Link
                      size="sm"
                      underline="hover"
                      href="/churches/addChurch"
                    >
                      Clicca qui
                    </Link>
                  </small>
                </>
              )}

              <Input
                {...register("id")}
                name="id"
                label="id"
                className="hidden"
                value={userData.id}
              />

              <Button
                color="primary"
                variant="shadow"
                type="submit"
                disabled={isSubmitting}
              >
                Aggiorna profilo
              </Button>
            </div>
          </form>
        )}
      {userData.pending_church_confirmation && (
        <div className="flex items-center justify-center w-full">
          <Alert
            color="primary"
            description="Attendi che i responsabili della tua chiesa confermino il tuo account."
            title="In attesa di conferma"
          />
        </div>
      )}
    </>
  );
}
