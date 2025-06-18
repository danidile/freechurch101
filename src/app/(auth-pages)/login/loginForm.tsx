"use client";
import { Spinner } from "@heroui/spinner";
import { signUpAction } from "@/app/actions";
import { signInAction } from "@/app/actions";
import {
  Input,
  Button,
  CardHeader,
  CardFooter,
  Autocomplete,
  AutocompleteItem,
  Alert,
} from "@heroui/react";
import { authSchema, TauthSchema } from "@/utils/types/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import SignInWithGoogleButton from "../SignInWithGoogleButton";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { useUserStore } from "@/store/useUserStore";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { GrFormNext } from "react-icons/gr";
import { getChurches } from "@/hooks/GET/getChurches";
import { church, registrationData } from "@/utils/types/types";
import { regristrationAction } from "./regristrationAction";
import registrationEmail from "./registrationEmail";
import { loginAction } from "./loginAction";

export default function LoginForm() {
  const router = useRouter();
  const pathname = usePathname();

  const [churchesList, setChurchesList] = useState<church[] | null>([]);
  const { userData, loading, fetchUser } = useUserStore();

  useEffect(() => {
    if (!loading && userData.loggedIn && userData.fetched) {
      router.push("/protected/dashboard/account");
    }
  }, [loading, userData.loggedIn, userData.fetched]);

  useEffect(() => {
    getChurches().then((fetchedChurchesList) => {
      setChurchesList(fetchedChurchesList);
    });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TauthSchema>({
    resolver: zodResolver(authSchema),
  });
  const [selected, setSelected] = useState<string>("accedi");

  const loginFunction = async () => {
    const response = await loginAction(formData);
    if (response) {
      setError(response);
    } else {
      if (pathname === "/login") {
        router.push("/protected/dashboard/account");
      }
      setSending(false);
      await fetchUser();
    }
  };

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  // REGISTER DATA

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward (optional)
  const [sending, setSending] = useState(false);
  const [isCreatingChurch, setIsCreatingChurch] = useState<boolean>(false);
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
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    setError("");
    if (step === 1 && (!formData.firstName || !formData.lastName)) {
      return setError("Inserisci nome e cognome per procedere.");
    }
    if (step === 2 && !isCreatingChurch && !formData.church) {
      return setError("Seleziona la tua chiesa");
    }
    setDirection(1);
    setStep(step + 1);
  };
  const handleBack = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const handleRegister = async () => {
    setError("");
    setSending(true);
    const response = await regristrationAction(formData, isCreatingChurch);
    if (response!.success) {
      registrationEmail(formData);
      router.push("/protected/dashboard/account");
      setSending(false);
      await fetchUser();
    } else if (response!.error) return setError(response.error);
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

  return (
    <div className="container-sub">
      <div className="flex flex-col">
        <Card className="max-w-full w-[340px]">
          <CardHeader className="text-center">
            <h1 className="text-2xl font-medium capitalize mx-auto my-4">
              {selected}
            </h1>
          </CardHeader>
          <CardBody>
            <Tabs
              fullWidth
              aria-label="Tabs form"
              selectedKey={selected}
              size="md"
              onSelectionChange={(key) => setSelected(String(key))}
            >
              <Tab key="accedi" title="Accedi">
                <form
                  className="flex flex-col gap-4"
                  onSubmit={handleSubmit(loginFunction)}
                >
                  <Input
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
                  <Link
                    href="/forgot-password"
                    className="text-center text-small text-blue-600 underline"
                  >
                    Password dimenticata?
                  </Link>
                  <Button
                    fullWidth
                    color="primary"
                    variant="shadow"
                    type="submit"
                    className="mb-4"
                    disabled={isSubmitting}
                    onPress={loginFunction}
                  >
                    {isSubmitting ? (
                      <Spinner color="white" size="sm" />
                    ) : (
                      "Accedi"
                    )}
                  </Button>
                  <SignInWithGoogleButton />
                  {error && (
                    <>
                      <Alert color="danger">{error}</Alert>
                    </>
                  )}
                </form>
              </Tab>

              <Tab key="iscriviti" title="Iscriviti">
                <form
                  className="flex flex-col gap-4"
                  onSubmit={handleSubmit(handleRegister)}
                >
                  {success ? (
                    <Alert color="success">
                      Utente registrato con successo!
                    </Alert>
                  ) : (
                    <>
                      <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                          key={step}
                          custom={direction}
                          variants={variants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          className="flex flex-col gap-4"
                          transition={{ duration: 0.4 }}
                        >
                          {step === 1 && (
                            <>
                              <Input
                                isRequired
                                minLength={3}
                                label="Nome"
                                name="firstName"
                                placeholder="Marco"
                                value={formData.firstName}
                                onChange={handleChange}
                              />

                              <Input
                                minLength={3}
                                isRequired
                                type="text"
                                label="Cognome"
                                name="lastName"
                                placeholder="Rossi"
                                value={formData.lastName}
                                onChange={handleChange}
                              />
                            </>
                          )}

                          {step === 2 && (
                            <>
                              {!isCreatingChurch && (
                                <>
                                  <Autocomplete
                                    defaultSelectedKey={userData.church_id}
                                    variant="bordered"
                                    isRequired={isCreatingChurch ? true : false}
                                    name="church"
                                    placeholder="La mia chiesa..."
                                    label="Seleziona la tua chiesa"
                                    selectedKey={formData.church}
                                    onSelectionChange={(key) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        church: String(key),
                                      }))
                                    }
                                  >
                                    {churchesList.map((church: church) => (
                                      <AutocompleteItem
                                        key={church.id}
                                        id={church.id}
                                        textValue={
                                          church.churchName +
                                          " " +
                                          church.address +
                                          " " +
                                          church.city +
                                          " " +
                                          church.provincia
                                        }
                                      >
                                        <p>{church.churchName}</p>
                                        <small className="truncate">
                                          {church.address && (
                                            <>{church.address + ", "}</>
                                          )}
                                          {church.provincia && (
                                            <>{church.provincia + ", "}</>
                                          )}
                                          {church.city && (
                                            <>{church.city + " "}</>
                                          )}
                                        </small>
                                      </AutocompleteItem>
                                    ))}
                                  </Autocomplete>
                                  <div className="flex flex-row justify-center items-center">
                                    <small>
                                      Se la tua chiesa non è nella lista
                                      <Button
                                        variant="light"
                                        color="primary"
                                        className="ml-2"
                                        onPress={() => {
                                          setIsCreatingChurch(true);
                                          setFormData((prev) => ({
                                            ...prev,
                                            isCreatingChurch: true,
                                          }));
                                        }}
                                      >
                                        Clicca qui
                                      </Button>
                                    </small>
                                  </div>
                                </>
                              )}
                              {isCreatingChurch && (
                                <>
                                  <Input
                                    {...register("churchName")}
                                    label="Church Name"
                                    name="churchName"
                                    placeholder="La mia chiesa "
                                    required
                                    value={formData.churchName}
                                    onChange={handleChange}
                                  />
                                  <Input
                                    {...register("pastor")}
                                    label="Pastor"
                                    name="pastor"
                                    placeholder="Paolo "
                                    required
                                    value={formData.pastor}
                                    onChange={handleChange}
                                  />
                                  <Input
                                    {...register("address")}
                                    label="Address"
                                    name="address"
                                    placeholder="Via XII Sett.."
                                    value={formData.address}
                                    onChange={handleChange}
                                  />
                                  <Input
                                    {...register("website")}
                                    label="Sito Web"
                                    name="website"
                                    placeholder="www.lamiachiesa.it"
                                    value={formData.website}
                                    onChange={handleChange}
                                  />
                                  <Input
                                    {...register("igHandle")}
                                    label="handle Instagram"
                                    name="igHandle"
                                    placeholder="@my_church"
                                    value={formData.igHandle}
                                    onChange={handleChange}
                                  />
                                </>
                              )}
                            </>
                          )}

                          {step === 3 && (
                            <>
                              <Input
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
                            </>
                          )}
                        </motion.div>
                      </AnimatePresence>

                      {error && (
                        <>
                          <Alert color="danger">{error}</Alert>
                        </>
                      )}

                      <div className="flex justify-between items-center mt-4">
                        {step > 1 && (
                          <Button
                            variant="light"
                            color="danger"
                            onPress={handleBack}
                          >
                            Indietro
                          </Button>
                        )}
                        {step < 3 ? (
                          <Button color="primary" onPress={handleNext}>
                            Avanti <GrFormNext />
                          </Button>
                        ) : (
                          <Button onPress={handleRegister} disabled={sending}>
                            {sending ? "..." : "Iscriviti"}
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </form>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
