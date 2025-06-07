"use client";
import { Button, Input } from "@heroui/react";
import { useForm } from "react-hook-form";

import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { completeAccountAction } from "./completeAccountAction";
import { basicUserData } from "@/utils/types/userData";
import { Alert } from "@heroui/react";
import Link from "next/link";
import { FaLock } from "react-icons/fa6";
import LoadingSongsPage from "@/app/songs/loading";
import { getProfileSetList } from "@/hooks/GET/getProfileSetLists";
import { getTeamsByProfile } from "@/hooks/GET/getTeamsByProfile";
import { useUserStore } from "@/store/useUserStore";
import { useState, useEffect } from "react";
import { getChurches } from "@/hooks/GET/getChurches";
import { useRouter } from "next/navigation";

export default function CompleteAccount() {
  const router = useRouter();

  const [churchesList, setChurchesList] = useState<any[] | null>([]);
  const { userData, fetchUser, loading } = useUserStore();

  // Step 2: Once user is available, fetch songs
  useEffect(() => {
    if (!loading && userData.loggedIn) {
      if (!userData.church_id) {
        getChurches().then((fetchedChurchesList) => {
          setChurchesList(fetchedChurchesList);
        });
      }
    }
  }, [loading, userData]);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<basicUserData>();

  const convertData = async (data: basicUserData) => {
    if (data.church_name) {
      const index = churchesList.findIndex(
        (church) => church.churchName === data.church_name
      );
      data.church_id = churchesList[index].id;
    }
    completeAccountAction(data);
    await fetchUser(); // client refetch
    router.push("/protected/dashboard/account"); // redirect AFTER store is up-to-date
  };

  return (
    <>
      <form onSubmit={handleSubmit(convertData)}>
        <h1 className="text-2xl font-medium">Completa il tuo Profilo</h1>

        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Link href="/protected/dashboard/account/updateImage">
            Aggiorna immagine profilo.
          </Link>
          <div className="flex gap-4 items-center">
            <Input
              {...register("name")}
              label="Nome"
              variant="bordered"
              size="sm"
              defaultValue={userData.name || ""}
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
                {churchesList.map(
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
        </div>
      </form>
    </>
  );
}
