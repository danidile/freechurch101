"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GrCircleAlert } from "react-icons/gr";
import { Link } from "@/i18n/navigation";
import { signupAction } from "./signupAction";

const signupSchema = z.object({
  name: z.string().min(2, "Il nome deve avere almeno 2 caratteri"),
  lastname: z.string().min(2, "Il cognome deve avere almeno 2 caratteri"),
  email: z.string().email("Email non valida"),
  password: z.string().min(8, "La password deve avere almeno 8 caratteri"),
  phone: z.string().min(6, "Numero di telefono non valido"),
  birthdate: z
    .string()
    .min(1, "La data di nascita è obbligatoria")
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, "Data non valida")
    .refine((val) => {
      const date = new Date(val);
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      const monthDiff = today.getMonth() - date.getMonth();
      const dayDiff = today.getDate() - date.getDate();
      const actualAge =
        monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
      return actualAge >= 13;
    }, "Devi avere almeno 13 anni per registrarti"),
});

type TSignupSchema = z.infer<typeof signupSchema>;

export default function SignupForm({ churchData }: { churchData: any }) {
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<TSignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const signupFunction = async (data: TSignupSchema) => {
    try {
      const response = await signupAction({
        name: data.name,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
        phone: data.phone,
        birthdate: new Date(data.birthdate),
        churchId: churchData.id,
      });

      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.error || "Errore durante la registrazione.");
      }
    } catch (err) {
      console.error("Unexpected signup error", err);
      setError("Errore inaspettato durante la registrazione.");
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto p-4 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-2xl">
            ✓
          </div>
          <h2 className="text-xl font-semibold">Registrazione completata!</h2>
          <p className="text-sm text-gray-600">
            Abbiamo inviato un'email di conferma al tuo indirizzo. Controlla la
            tua casella di posta e clicca sul link per attivare l'account.
          </p>
          <Link href="/login" className="text-sm text-blue-600 underline mt-2">
            Torna al login
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full max-w-md mx-auto p-4">
      {churchData.logo && (
        <>
          <img
            className="max-w-[275px] mx-auto mb-8"
            src={`https://kadorwmjhklzakafowpu.supabase.co/storage/v1/object/public/churchlogo/${churchData.logo}`}
            alt=""
          />
        </>
      )}
      <h2 className="text-2xl font-semibold mb-2 text-center">
        Crea un account con
        <br />
        <span className="underline">{churchData.church_name}</span>
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Hai già un account?{" "}
        <Link href="/login" className="text-sm text-blue-600 underline">
          <strong>Accedi qui</strong>
        </Link>
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(signupFunction)(e);
        }}
        noValidate
        className="flex flex-col gap-4"
      >
        {/* Name + Lastname */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nome
            </label>
            <input
              {...register("name")}
              type="text"
              id="name"
              placeholder="Mario"
              className="cinput"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="flex-1">
            <label
              htmlFor="lastname"
              className="block text-sm font-medium mb-1"
            >
              Cognome
            </label>
            <input
              {...register("lastname")}
              type="text"
              id="lastname"
              placeholder="Rossi"
              className="cinput"
            />
            {errors.lastname && (
              <p className="text-xs text-red-500 mt-1">
                {errors.lastname.message}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            placeholder="mario@esempio.com"
            className="cinput"
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <div className="relative">
            <input
              {...register("password")}
              type={isVisible ? "text" : "password"}
              id="password"
              placeholder="Minimo 8 caratteri"
              className="cinput"
            />
            <button
              type="button"
              onClick={toggleVisibility}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
              aria-label="toggle password visibility"
            >
              {isVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Telefono
          </label>
          <input
            {...register("phone")}
            type="tel"
            id="phone"
            placeholder="+39 333 123 4567"
            className="cinput"
          />
          {errors.phone && (
            <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Birthdate */}
        <div>
          <label htmlFor="birthdate" className="block text-sm font-medium mb-1">
            Data di nascita
          </label>
          <input
            {...register("birthdate")}
            type="date"
            id="birthdate"
            className="cinput"
            max={new Date().toISOString().split("T")[0]}
          />
          {errors.birthdate && (
            <p className="text-xs text-red-500 mt-1">
              {errors.birthdate.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 text-white rounded-md bg-black hover:bg-gray-800 transition mt-2 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Caricamento..." : "Crea account"}
        </button>

        {error && (
          <div className="flex items-center gap-2 rounded-md bg-red-100 p-3 text-sm text-red-800 border border-red-300">
            <GrCircleAlert />
            <p>{error}</p>
          </div>
        )}

        <p className="text-xs text-gray-400 text-center mt-2">
          Registrandoti accetti i nostri{" "}
          <Link href="/terms" className="underline">
            Termini di servizio
          </Link>{" "}
          e la{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </div>
  );
}
