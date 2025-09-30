"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema, TauthSchema } from "@/utils/types/auth";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Comune } from "@/utils/types/types";
import { regristrationAction } from "./regristrationAction";
import { addToast } from "@heroui/react"; // If you want native toast, you can replace this
import { AutocompleteInput } from "./AutocompleteInput";
import { GrCircleAlert } from "react-icons/gr";
import sendChurchCreationConfirmationEmail from "./sendChurchCreationEmail";
import { IoIosSend } from "react-icons/io";

export default function CreateChurch() {
  const router = useRouter();
  const { userData, loading, fetchUser } = useUserStore();
  const [error, setError] = useState("");

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
    control,
    formState: { errors },
  } = useForm<TauthSchema>({
    resolver: zodResolver(authSchema),
  });
  useEffect(() => {
    console.log("Errors:", errors);
  }, [errors]);
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible((v) => !v);

  const [direction] = useState(1);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (data: TauthSchema) => {
    setSending(true);
    const response = await regristrationAction(data);
    if (response.success) {
      try {
        const data = {
          firstName: `${getValues("firstname")} `,
          lastName: getValues("lastname"),
          email: getValues("email"),
          churchName: getValues("churchname"),
        };
        const response = await sendChurchCreationConfirmationEmail(data);

        if (response.error) {
          addToast({
            title: `Errore nell'invio della mail a ${data.firstName}`,
            description: response.error,
            icon: <IoIosSend />,
            color: "danger",
          });
        } else {
          addToast({
            title: `Email Inviata con successo a ${data.firstName}`,
            description: response.message,
            icon: <IoIosSend />,
            color: "success",
          });
        }
      } catch (error) {
        console.error("Error sending email:", error);
      } finally {
      }
      await fetchUser();

      router.push("/protected/dashboard/account");
    } else {
      setError(response.error);
      setSending(false);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const [comuni, setComuni] = useState<Comune[]>([]);
  const [filteredComuni, setFilteredComuni] = useState<Comune[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    async function fetchComuni() {
      const res = await fetch("/data/comuni.json");
      const data = await res.json();
      setComuni(data);
    }
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
    <div className="container-sub px-4">
      <h2 className="font-regular my-12 text-3xl text-center">
        Crea una nuova chiesa
      </h2>

      <form onSubmit={handleSubmit(handleRegister)} noValidate>
        {success && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md text-center">
            Utente registrato con successo!
          </div>
        )}

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key="form-step"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-2"
          >
            {/* Personal Info */}
            <section>
              <small className="text-gray-600">Informazioni personali</small>
              <hr className="border-gray-300 my-2" />
              <div className="flex flex-wrap gap-6 justify-center">
                <div className="flex flex-col w-full sm:w-72">
                  <label htmlFor="firstname" className="  font-medium">
                    Nome
                  </label>
                  <input
                    id="firstname"
                    type="text"
                    placeholder="Marco"
                    {...register("firstname")}
                    className={`cinput ${errors.firstname ? "border-red-500" : "border-gray-300"}`}
                    aria-invalid={!!errors.firstname}
                    aria-describedby="firstname-error"
                  />
                  {errors.firstname && (
                    <p
                      id="firstname-error"
                      className="text-red-600 text-sm mt-1"
                    >
                      {errors.firstname.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col w-full sm:w-72">
                  <label htmlFor="lastname" className="  font-medium">
                    Cognome
                  </label>
                  <input
                    id="lastname"
                    type="text"
                    placeholder="Rossi"
                    {...register("lastname")}
                    className={`cinput ${errors.lastname ? "border-red-500" : "border-gray-300"}`}
                    aria-invalid={!!errors.lastname}
                    aria-describedby="lastname-error"
                  />
                  {errors.lastname && (
                    <p
                      id="lastname-error"
                      className="text-red-600 text-sm mt-1"
                    >
                      {errors.lastname.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-6 justify-center mt-0">
                <div className="flex flex-col w-full sm:w-72">
                  <label htmlFor="email" className="  font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="email..."
                    {...register("email")}
                    className={`mt-1 cinput ${errors.email ? "border-red-500" : "border-gray-300"}`}
                    aria-invalid={!!errors.email}
                    aria-describedby="email-error"
                  />
                  {errors.email && (
                    <p id="email-error" className="text-red-600 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col w-full sm:w-72">
                  <label htmlFor="password" className="font-medium">
                    Password
                  </label>

                  {/* wrapper relative to input height */}
                  <div className="relative mt-1">
                    <input
                      id="password"
                      type={isVisible ? "text" : "password"}
                      placeholder="Inserisci la password"
                      {...register("password")}
                      minLength={8}
                      className={`cinput pr-10 ${errors.password ? "border-red-500" : "border-gray-300"}`}
                      aria-invalid={!!errors.password}
                      aria-describedby="password-error"
                    />
                    <button
                      type="button"
                      onClick={toggleVisibility}
                      aria-label="Toggle password visibility"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                      tabIndex={-1}
                    >
                      {isVisible ? (
                        <FaEyeSlash className="text-xl pointer-events-none" />
                      ) : (
                        <FaEye className="text-xl pointer-events-none" />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p
                      id="password-error"
                      className="text-red-600 text-sm mt-1"
                    >
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Church Info */}
            <section className="mt-4">
              <small className="text-gray-600">Informazioni chiesa</small>
              <hr className="border-gray-300 " />
              <div className="flex flex-wrap gap-6 justify-center">
                <div className="flex flex-col w-full sm:w-72">
                  <label htmlFor="churchname" className="  font-medium">
                    Nome Chiesa
                  </label>
                  <input
                    id="churchname"
                    type="text"
                    placeholder="La mia chiesa"
                    {...register("churchname")}
                    className={`cinput ${errors.churchname ? "border-red-500" : "border-gray-300"}`}
                    aria-invalid={!!errors.churchname}
                    aria-describedby="churchname-error"
                  />
                  {errors.churchname && (
                    <p
                      id="churchname-error"
                      className="text-red-600 text-sm mt-1"
                    >
                      {errors.churchname.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col w-full sm:w-72">
                  <label htmlFor="pastor" className="  font-medium">
                    Pastor
                  </label>
                  <input
                    id="pastor"
                    type="text"
                    placeholder="Paolo"
                    {...register("pastor")}
                    className={`cinput ${errors.pastor ? "border-red-500" : "border-gray-300"}`}
                    aria-invalid={!!errors.pastor}
                    aria-describedby="pastor-error"
                  />
                  {errors.pastor && (
                    <p id="pastor-error" className="text-red-600 text-sm mt-1">
                      {errors.pastor.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-6 justify-center">
                <div className="flex flex-col w-full sm:w-72">
                  <label htmlFor="website" className="  font-medium">
                    Sito Web
                  </label>
                  <input
                    id="website"
                    type="text"
                    placeholder="www.lamiachiesa.it"
                    {...register("website")}
                    className={`cinput ${errors.website ? "border-red-500" : "border-gray-300"}`}
                    aria-invalid={!!errors.website}
                    aria-describedby="website-error"
                  />
                  {errors.website && (
                    <p id="website-error" className="text-red-600 text-sm mt-1">
                      {errors.website.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col w-full sm:w-72">
                  <label htmlFor="ighandle" className="  font-medium">
                    Handle Instagram
                  </label>
                  <input
                    id="ighandle"
                    type="text"
                    placeholder="@my_church"
                    {...register("ighandle")}
                    className={`cinput ${errors.ighandle ? "border-red-500" : "border-gray-300"}`}
                    aria-invalid={!!errors.ighandle}
                    aria-describedby="ighandle-error"
                  />
                  {errors.ighandle && (
                    <p
                      id="ighandle-error"
                      className="text-red-600 text-sm mt-1"
                    >
                      {errors.ighandle.message}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Room Info */}
            <section className=" mt-4">
              <small className="text-gray-600">Indirizzo Chiesa</small>
              <hr className="border-gray-300" />

              <div className="flex flex-wrap gap-6 justify-center">
                <div className="flex flex-col w-full sm:w-72 relative">
                  <Controller
                    name="comune"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <AutocompleteInput
                        label="Comune"
                        options={comuni}
                        value={field.value}
                        onChange={(val) => field.onChange(val)}
                        onSelect={(selected) => {
                          field.onChange(selected.nome);
                          setValue("provincia", selected.sigla); // Set provincia too
                        }}
                        error={errors.comune?.message}
                      />
                    )}
                  />
                </div>

                <input type="hidden" {...register("provincia")} />

                <div className="flex flex-col w-full sm:w-72">
                  <label htmlFor="address" className=" font-medium">
                    Indirizzo
                  </label>
                  <input
                    id="address"
                    type="text"
                    placeholder="Via XII Sett.."
                    {...register("address")}
                    className={`cinput ${errors.address ? "border-red-500" : "border-gray-300"}`}
                    aria-invalid={!!errors.address}
                    aria-describedby="address-error"
                  />
                  {errors.address && (
                    <p id="address-error" className="text-red-600 text-sm mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>
              </div>
            </section>
          </motion.div>
        </AnimatePresence>
        {error && (
          <div className="flex items-center gap-4 my-4 rounded-md bg-red-100 p-3 text-sm text-red-800 border border-red-300">
            <GrCircleAlert size={23} />

            <p>
              <span className="font-medium">
                Errore durante la creazione della chiesa:
              </span>
              <br />
              <>{error}</>
            </p>
          </div>
        )}

        <div className="flex justify-center mt-4">
          <button
            type="submit"
            disabled={sending}
            className="w-full max-w-xs bg-black text-white py-3 rounded-md hover:bg-gray-900 transition-colors"
          >
            {sending ? "..." : "Iscriviti e Crea Chiesa"}
          </button>
        </div>
      </form>
    </div>
  );
}
