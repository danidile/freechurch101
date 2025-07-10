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
    formState: { isSubmitting },
  } = useForm<TauthSchema>({
    resolver: zodResolver(authSchema),
  });

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  // REGISTER DATA

  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward (optional)
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<registrationData>({
    firstName: "",
    lastName: "",
    church: "",
    email: "",
    password: "",
    isCreatingChurch: false,
    churchName: "",
    pastor: "",
    address: "",
    website: "",
    igHandle: "",
    provincia: "",
    city: "",
    comune: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    console.log("formData", formData);

    setError("");
    setSending(true);
    const response = await regristrationAction(formData);
    if (response.success) {
      router.push("/protected/dashboard/account");

      setSending(false);
    } else {
      addToast({
        title: `Errore durante il login:`,
        description: response.error,
        color: "danger",
      });
      setError(response.error);

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

        <form className="flex flex-col gap-4 ">
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
                      isRequired
                      minLength={3}
                      size="sm"
                      variant="underlined"
                      label="Nome"
                      name="firstName"
                      placeholder="Marco"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="min-w-[300px]"
                    />

                    <Input
                      size="sm"
                      variant="underlined"
                      minLength={3}
                      isRequired
                      type="text"
                      label="Cognome"
                      name="lastName"
                      placeholder="Rossi"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="min-w-[300px]"
                    />
                  </div>
                  <div className="flex flex-row flex-wrap items-center justify-center gap-4">
                    <Input
                      size="sm"
                      variant="underlined"
                      {...register("email")}
                      isRequired
                      name="email"
                      label="Email"
                      placeholder="email..."
                      minLength={8}
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <Input
                      size="sm"
                      variant="underlined"
                      name="password"
                      {...register("password")}
                      isRequired
                      value={formData.password}
                      onChange={handleChange}
                      label="Password"
                      minLength={8}
                      placeholder="password..."
                      endContent={
                        <button
                          aria-label="toggle password visibility"
                          className="focus:outline-none"
                          type="button"
                          onClick={toggleVisibility}
                        >
                          {isVisible ? (
                            <FaEyeSlash className="text-xl text-default-400 pointer-events-none" />
                          ) : (
                            <FaEye className="text-xl text-default-400 pointer-events-none" />
                          )}
                        </button>
                      }
                      type={isVisible ? "text" : "password"}
                    />
                  </div>
                  <small>Informazioni chiesa</small>
                  <div className="border-b-1 border-b- "></div>
                  <div className="flex flex-row flex-wrap items-center justify-center gap-4">
                    <Input
                      size="sm"
                      variant="underlined"
                      {...register("churchName")}
                      label="Church Name"
                      name="churchName"
                      placeholder="La mia chiesa "
                      isRequired
                      value={formData.churchName}
                      onChange={handleChange}
                    />
                    <Input
                      size="sm"
                      variant="underlined"
                      {...register("pastor")}
                      label="Pastor"
                      name="pastor"
                      placeholder="Paolo "
                      isRequired
                      value={formData.pastor}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-row flex-wrap items-center justify-center gap-4">
                    <Input
                      size="sm"
                      variant="underlined"
                      {...register("website")}
                      label="Sito Web"
                      name="website"
                      placeholder="www.lamiachiesa.it"
                      value={formData.website}
                      onChange={handleChange}
                    />
                    <Input
                      size="sm"
                      variant="underlined"
                      {...register("igHandle")}
                      label="handle Instagram"
                      name="igHandle"
                      placeholder="@my_church"
                      value={formData.igHandle}
                      onChange={handleChange}
                    />
                  </div>

                  <small>Crea sala</small>
                  <div className="border-b-1 border-b- "></div>
                  <div className="flex flex-row items-center justify-center gap-4">
                    <Input
                      size="sm"
                      variant="underlined"
                      {...register("room_name")}
                      label="Nome stanza"
                      name="room_name"
                      placeholder="Sala culto"
                      value={formData.room_name}
                      onChange={handleChange}
                      isRequired
                    />
                  </div>
                  <div className="flex flex-row items-center justify-center gap-4">
                    <Autocomplete
                      size="sm"
                      variant="underlined"
                      label="Comune"
                      selectedKey={selectedKey ?? undefined}
                      onSelectionChange={(key) => {
                        const selectedComune = filteredComuni.find(
                          (c) => c.codice === key
                        );
                        setSelectedKey(key as string);
                        setInputValue(selectedComune?.nome ?? "");

                        // Sync with formData
                        setFormData((prev) => ({
                          ...prev,
                          comune: selectedComune ? selectedComune.nome : "",
                        }));
                      }}
                      {...register("comune")}
                      inputValue={inputValue}
                      onInputChange={(value) => setInputValue(value)}
                      placeholder="Cerca un comune"
                      isClearable
                      className="max-w-[300px]"
                      isRequired
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
                      size="sm"
                      variant="underlined"
                      {...register("address")}
                      label="Indirizzo"
                      name="address"
                      placeholder="Via XII Sett.."
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              {error && (
                <>
                  <Alert color="danger" description={error}></Alert>
                </>
              )}
              <div className="flex justify-between items-center mt-4 gap-4">
                <Button
                  onPress={handleRegister}
                  disabled={sending}
                  fullWidth
                  color="primary"
                  variant="solid"
                  className="mb-4 bg-gradient-to-br from-[#474be1] to-[#0e117f] text-white"
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
