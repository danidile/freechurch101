"use client";
import { useForm } from "react-hook-form";

import { Button, Input } from "@heroui/react";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Image,
} from "@heroui/react";
import { useSearchParams } from "next/navigation";

import { retriveShareFormAction } from "./retriveShareFormAction";
import GetParamsMessage from "@/app/components/getParams";
export default function RetriveShareForm() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      text: "",
    },
  });
  const visualizzaListaCanzoni = (event: any) => {
    console.log(event.text);
    retriveShareFormAction(event.text);
  };

  return (
    <>
      <Card className="max-w-[400px] my-5">
        <CardHeader className="flex gap-3">
          <Image
            alt="heroui logo"
            height={40}
            radius="sm"
            src="/images/import-song.png"
            width={40}
          />
          <div className="flex flex-col">
            <p className="text-md">Importa Canzoni</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <p>
            Inserisci il codice SHARE per accedere alla lista di un altra chiesa
            ed importare le loro canzoni!
          </p>{" "}
          <form
            action=""
            className="songs-searchbar-form"
            onSubmit={handleSubmit(visualizzaListaCanzoni)}
          >
            <Input
              {...register("text")}
              placeholder="#4ufb5f"
              label="SHARE code"
              className="max-w-48 my-4 mx-auto"
              variant="bordered"
              type="text"
            />
            <Button
              color="primary"
              className="my-7"
              type="submit"
              disabled={isSubmitting}
            >
              Visualizza Lista Canzoni
            </Button>
          </form>
        </CardBody>
      </Card>

    </>
  );
}
