"use client";
import { Button, Input, Spinner } from "@heroui/react";
import { useForm } from "react-hook-form";

import { createTempProfile } from "./createTempProfileAction";
import { basicUserData } from "@/utils/types/userData";

export default function CreateTempProfileForm({
  userData,
}: {
  userData: basicUserData;
}) {
  const {
    register,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<basicUserData>({
    // No resolver needed, only TypeScript type
  });

  const convertData = async (data: basicUserData) => {
    let updatedData: basicUserData = watchData;
    updatedData.church_id = userData.church_id;
    console.log("updatedData");
    console.log(updatedData);
    createTempProfile(updatedData);
  };
  const watchData = watch();

  return (
    <div className="container-sub">
      <form onSubmit={handleSubmit(convertData)}>
        <h1 className="text-2xl font-medium">Crea profilo temporaneo</h1>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <div className="flex gap-4 items-center">
            <Input
              {...register("name")}
              label="Nome"
              variant="bordered"
              size="sm"
            />
            <Input
              {...register("lastname")}
              label="Cognome"
              variant="bordered"
              size="sm"
            />
          </div>

          <Input {...register("id")} name="id" label="id" className="hidden" />

          <Button
            color="primary"
            variant="shadow"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Spinner size="sm" color="white" />
            ) : (
              "Crea profilo"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
