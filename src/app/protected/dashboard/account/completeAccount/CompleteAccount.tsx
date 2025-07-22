"use client";
import { Avatar, Button, Input } from "@heroui/react";
import { useForm } from "react-hook-form";

import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { completeAccountAction } from "./completeAccountAction";
import { basicUserData } from "@/utils/types/userData";
import Link from "next/link";
import { FaLock } from "react-icons/fa6";
import { useUserStore } from "@/store/useUserStore";
import { useState, useEffect } from "react";
import { getChurches } from "@/hooks/GET/getChurches";
import { useRouter } from "next/navigation";
import ImageUploader from "../updateImage/ImageUploader";

export default function CompleteAccount() {
  const router = useRouter();

  const [uploadPicture, setUploadPicture] = useState<boolean>(false);
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
    data.id = userData.id;
    console.log("DATA", data);
    completeAccountAction(data);
    await fetchUser(); // client refetch
    router.push("/protected/dashboard/account"); // redirect AFTER store is up-to-date
  };
  return (
    <>
      <h4>Completa il tuo Profilo</h4>
      <Link href={"/protected/reset-password"} className="underline">
        <small> Clicca qui per modificare la tua password.</small>
      </Link>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        {!uploadPicture && (
          <>
            <div
              onClick={() => setUploadPicture(true)}
              className="flex flex-row gap-4 items-center justify-center cursor-pointer!"
            >
              <Avatar
                size="lg"
                className="transition-transform "
                src={
                  `https://kadorwmjhklzakafowpu.supabase.co/storage/v1/object/public/avatars/${userData.avatar_url}` ||
                  "/images/userAvatarDefault.jpg"
                }
              />
              <p>Aggiorna immagine profilo.</p>
            </div>
          </>
        )}
        {uploadPicture && (
          <>
            <ImageUploader
              closeState={setUploadPicture}
              type="profilepicture"
            />
          </>
        )}{" "}
        <form onSubmit={handleSubmit(convertData)}>
          <div className="flex gap-4 items-center">
            <Input
              {...register("name")}
              name="name"
              label="Nome"
              variant="bordered"
              size="sm"
              placeholder={userData.name}
            />
            <Input
              {...register("lastname")}
              name="lastname"
              label="Cognome"
              variant="bordered"
              size="sm"
              placeholder={userData.lastname}
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
              <FaLock className="text-l text-default-500 pointer-events-none shrink-0 my-auto" />
            }
          />
          <Input
            {...register("phone")}
            label="Telefono"
            variant="bordered"
            size="sm"
            type="tel"
            placeholder={userData.phone}
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
        </form>
      </div>
    </>
  );
}
