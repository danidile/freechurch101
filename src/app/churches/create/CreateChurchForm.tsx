"use client";
import {
  Input,
  Button,
  Autocomplete,
  AutocompleteItem,
  Alert,
  Link,
  addToast,
} from "@heroui/react";
import { authSchema, TauthSchema } from "@/utils/types/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";

import { AnimatePresence, motion } from "framer-motion";

import { Comune, registrationData } from "@/utils/types/types";
import { regristrationAction } from "./regristrationAction";
import registrationEmail from "./registrationEmail";

export default function CreateChurch() {
  const router = useRouter();

  const { userData, loading, fetchUser } = useUserStore();

  useEffect(() => {
    if (!loading && userData.loggedIn && userData.fetched) {
      router.push("/protected/dashboard/account");
    }
  }, [loading, userData.loggedIn, userData.fetched]);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<TauthSchema>({
    resolver: zodResolver(authSchema),
  });

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  // REGISTER DATA

  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward (optional)
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (data: TauthSchema) => {

    setSending(true);
    const response = await regristrationAction(data);
    if (response.success) {
      router.push("/protected/dashboard/account");

      setSending(false);
    } else {
      addToast({
        title: `Errore durante il login:`,
        description: response.error,
        color: "danger",
      });

      await fetchUser();
    }
    setSuccess(true);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };
  const [comuni, setComuni] = useState<Comune[]>([]);
  const [filteredComuni, setFilteredComuni] = useState<Comune[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const fetchComuni = async () => {
      const res = await fetch("/data/comuni.json");
      const data = await res.json();
      setComuni(data);
    };
    fetchComuni();
  }, []);

  useEffect(() => {
    if (inputValue.length > 1) {
      const filtered = comuni
        .filter((comune) =>
          comune.nome.toLowerCase().startsWith(inputValue.toLowerCase())
        )
        .slice(0, 10);
      setFilteredComuni(filtered);
    } else {
      setFilteredComuni([]);
    }
  }, [inputValue, comuni]);
  return (
    <div className="container-sub">
      <div className="flex flex-col">
        <h2 className="font-regular my-12"> Crea una nuova chiesa</h2>

        <form onSubmit={handleSubmit(handleRegister)}>
          {success ? (
            <Alert color="success">Utente registrato con successo!</Alert>
          ) : (
            <>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="flex flex-col gap-4"
                  transition={{ duration: 0.4 }}
                >
                  <small>Informazioni personali</small>
                  <div className="border-b-1 border-b- "></div>
                  <div className="flex flex-row flex-wrap items-center justify-center gap-4">
                    <Input
                      {...register("firstname")}
                      errorMessage={errors.firstname?.message}
                      size="sm"
                      variant="underlined"
                      isInvalid={!!errors.firstname}
                      label="Nome"
                      placeholder="Marco"
                    />

                    <Input
                      size="sm"
                      variant="underlined"
                      type="text"
                      label="Cognome"
                      placeholder="Rossi"
                      isInvalid={!!errors.lastname}
                      errorMessage={errors.lastname?.message}
                      {...register("lastname")}
                    />
                  </div>
                  <div className="flex flex-row flex-wrap items-center justify-center gap-4">
                    <Input
                      size="sm"
                      variant="underlined"
                      {...register("email")}
                      errorMessage={errors.email?.message}
                      isInvalid={!!errors.email}
                      label="Email"
                      placeholder="email..."
                      type="email"
                    />
                    <Input
                      {...register("password")}
                      errorMessage={errors.password?.message}
                      isInvalid={!!errors.password}
                      size="sm"
                      variant="underlined"
                      label="Password"
                      placeholder="Inserisci la password"
                      type={isVisible ? "text" : "password"}
                      minLength={8}
                      endContent={
                        <button
                          type="button"
                          onClick={toggleVisibility}
                          aria-label="Toggle password visibility"
                          className="focus:outline-none"
                        >
                          {isVisible ? (
                            <FaEyeSlash className="text-xl text-default-400 pointer-events-none" />
                          ) : (
                            <FaEye className="text-xl text-default-400 pointer-events-none" />
                          )}
                        </button>
                      }
                    />
                  </div>
                  <small>Informazioni chiesa</small>
                  <div className="border-b-1 border-b- "></div>
                  <div className="flex flex-row flex-wrap items-center justify-center gap-4">
                    <Input
                      size="sm"
                      variant="underlined"
                      {...register("churchname")}
                      errorMessage={errors.churchname?.message}
                      isInvalid={!!errors.churchname}
                      label="Nome Chiesa"
                      placeholder="La mia chiesa "
                    />
                    <Input
                      size="sm"
                      variant="underlined"
                      label="Pastor"
                      placeholder="Paolo "
                      {...register("pastor")}
                      errorMessage={errors.pastor?.message}
                      isInvalid={!!errors.pastor}
                    />
                  </div>
                  <div className="flex flex-row flex-wrap items-center justify-center gap-4">
                    <Input
                      size="sm"
                      variant="underlined"
                      {...register("website")}
                      errorMessage={errors.website?.message}
                      isInvalid={!!errors.website}
                      label="Sito Web"
                      placeholder="www.lamiachiesa.it"
                    />
                    <Input
                      size="sm"
                      variant="underlined"
                      label="handle Instagram"
                      placeholder="@my_church"
                      {...register("ighandle")}
                      errorMessage={errors.ighandle?.message}
                      isInvalid={!!errors.ighandle}
                    />
                  </div>

                  <small>Crea sala</small>
                  <div className="border-b-1 border-b- "></div>
                  <div className="flex flex-row items-center justify-center gap-4">
                    <Input
                      size="sm"
                      variant="underlined"
                      {...register("room_name")}
                      errorMessage={errors.room_name?.message}
                      isInvalid={!!errors.room_name}
                      label="Nome stanza"
                      name="room_name"
                      placeholder="Sala culto"
                    />
                  </div>
                  <div className="flex flex-row items-center justify-center gap-4">
                    <Autocomplete
                      size="sm"
                      {...register("comune")}
                      errorMessage={errors.comune?.message}
                      isInvalid={!!errors.comune}
                      variant="underlined"
                      label="Comune"
                      selectedKey={selectedKey ?? undefined}
                      onSelectionChange={(key) => {
                        const selectedComune = filteredComuni.find(
                          (c) => c.codice === key
                        );
                        setSelectedKey(key as string);
                        setInputValue(selectedComune?.nome ?? "");

                        if (selectedComune) {
                          setValue("comune", selectedComune.nome); // Set comune field
                          setValue("provincia", selectedComune.sigla); // Set provincia field
                        }
                      }}
                      {...register("comune")}
                      inputValue={inputValue}
                      onInputChange={(value) => setInputValue(value)}
                      placeholder="Cerca un comune"
                      isClearable
                      className="max-w-[300px]"
                    >
                      {filteredComuni.map((comune) => (
                        <AutocompleteItem
                          key={comune.codice}
                          textValue={comune.nome}
                        >
                          {comune.nome} ({comune.sigla})
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                    <Input
                      {...register("provincia")}
                      value={getValues("provincia")}
                      type="hidden"
                    />
                    <Input
                      size="sm"
                      variant="underlined"
                      {...register("address")}
                      label="Indirizzo"
                      placeholder="Via XII Sett.."
                      errorMessage={errors.address?.message}
                      isInvalid={!!errors.address}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between items-center mt-4 gap-4">
                <Button
                  disabled={sending}
                  fullWidth
                  type="submit"
                  color="primary"
                  variant="solid"
                  className="mb-4 bg-black text-white"
                >
                  {sending ? "..." : "Iscriviti e Crea Chiesa"}
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
