"use client";
import { Spinner } from "@heroui/spinner";
import {
  Input,
  Button,
  CardHeader,
  Autocomplete,
  AutocompleteItem,
  Alert,
  addToast,
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
    if (response.success) {
      if (pathname === "/login") {
        router.push("/protected/dashboard/account");
      }
      setSending(false);
    } else {
      addToast({
        title: `Errore durante il login:`,
        description: response.error,
        color: "danger",
      });
      setError(response.error);
    }
    await fetchUser();
  };

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  // REGISTER DATA
  const [churchSearchQuery, setChurchSearchQuery] = useState("");
  const filteredChurches =
    churchSearchQuery.length < 2
      ? []
      : churchesList.filter((church) =>
          (church.churchName + church.address + church.city + church.provincia)
            .toLowerCase()
            .includes(churchSearchQuery.toLowerCase())
        );
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
    <div className="w-full max-w-[400px]">
      <h2 className="font-regular">Accedi</h2>
      <small>
        Non hai un account? Se la tua chiesa è già registrata, chiedi al tuo
        responsabile di invitarti.
      </small>{" "}
      <Link href="/churches/create" className="text-center text-small ">
        <small>
          Altrimenti, <strong className="underlined ">Clicca qui</strong> per
          creare un account per la tua chiesa.
        </small>
      </Link>
      <form
        className="flex mt-12 flex-col gap-4 max-w-[500px] w-full"
        onSubmit={handleSubmit(loginFunction)}
      >
        <Input
          {...register("email")}
          isRequired
          name="email"
          label="Email"
          variant="underlined"
          size="sm"
          fullWidth
          placeholder="email..."
          minLength={8}
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          fullWidth
          variant="underlined"
          size="sm"
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

        <Button
          fullWidth
          variant="solid"
          type="submit"
          radius="sm"
          className="mb-4 bg-black text-white"
          disabled={isSubmitting}
          onPress={loginFunction}
        >
          {isSubmitting ? <Spinner color="white" size="sm" /> : "Accedi"}
        </Button>
        {/* <SignInWithGoogleButton /> */}
        {error && (
          <>
            <Alert color="danger">{error}</Alert>
          </>
        )}
        <Link href="/forgot-password" className="text-center text-small ">
          <span className="text-gray-500">Password dimenticata? </span>
          <strong className="underlined ">Clicca qui</strong>
        </Link>
      </form>
    </div>
  );
}
