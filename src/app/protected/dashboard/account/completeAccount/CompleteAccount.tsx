"use client";
import { Avatar, Button, Input } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { completeAccountAction } from "./completeAccountAction";
import { basicUserData, basicUserDataSchema } from "@/utils/types/userData";
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
    formState: { errors, isSubmitting },
    reset,
  } = useForm<basicUserData>({
    resolver: zodResolver(basicUserDataSchema),
    defaultValues: userData, // your user data with default values
  });

  const convertData = async (data: basicUserData) => {
    if (data.church_name) {
      const index = churchesList.findIndex(
        (church) => church.churchName === data.church_name
      );
      if (index !== -1) {
        data.church_id = churchesList[index].id;
      }
    }
    data.id = userData.id;
    await completeAccountAction(data);
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
                  `https://kadorwmjhklzakafowpu.supabase.co/storage/v1/object/public/avatars/${userData.avatar_url}?t=${Date.now()}` ||
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
        <form
          onSubmit={handleSubmit(convertData)}
          className="flex flex-col gap-2 items-center"
        >
          <div className="flex gap-2 items-center">
            <div className="flex flex-col">
              <label htmlFor="name" className="mb-1 font-medium">
                Nome
              </label>
              <input
                id="name"
                {...register("name")}
                type="text"
                placeholder={userData.name}
                className={`cinput ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <span className="text-red-600 text-xs mt-1">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <label htmlFor="lastname" className="mb-1 font-medium">
                Cognome
              </label>
              <input
                id="lastname"
                {...register("lastname")}
                type="text"
                placeholder={userData.lastname}
                className={`cinput ${
                  errors.lastname ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.lastname && (
                <span className="text-red-600 text-xs mt-1">
                  {errors.lastname.message}
                </span>
              )}
            </div>
          </div>

          {userData.church_id && (
            <p>
              La mia chiesa: <strong>{userData.church_name}</strong>
            </p>
          )}

          <div className="flex flex-col w-full">
            <label htmlFor="email" className="mb-1 font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={userData.email || ""}
              disabled
              className="cinput cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="phone" className="mb-1 font-medium">
              Telefono
            </label>
            <input
              id="phone"
              {...register("phone")}
              type="tel"
              placeholder={userData.phone}
              className={`cinput ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.phone && (
              <span className="text-red-600 text-xs mt-1">
                {errors.phone.message}
              </span>
            )}
          </div>

          {/* Hidden input for id */}
          <input
            {...register("id")}
            id="id"
            type="hidden"
            value={userData.id}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Aggiorna profilo
          </button>
        </form>
      </div>
    </>
  );
}
