"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, TauthSchema } from "@/utils/types/auth";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useUserStore } from "@/store/useUserStore";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { loginData } from "@/utils/types/types";
import { loginAction } from "./loginAction";
import { GrCircleAlert } from "react-icons/gr";

export default function LoginForm() {
  const router = useRouter();
  const pathname = usePathname();
  const { userData, loading, fetchUser } = useUserStore();

  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TauthSchema>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (!loading && userData.loggedIn && userData.fetched) {
      router.push("/protected/dashboard/account");
    }
  }, [loading, userData]);

  const loginFunction = async (data: loginData) => {
    try {
      const response = await loginAction(data);
      if (response.success) {
        if (pathname === "/login") {
          router.push("/protected/dashboard/account");
        }
        await fetchUser();
      } else {
        setError(response.error);
      }
    } catch (err) {
      console.error("Unexpected login error", err);
      setError("Errore inaspettato durante il login.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-2">Accedi</h2>
      <p className="text-sm text-gray-600 mb-2">
        Non hai un account? Se la tua chiesa è già registrata, chiedi al tuo
        responsabile di invitarti.{" "}
        <Link
          href="/churches/create"
          className="text-sm text-blue-600 underline"
        >
          Altrimenti, <strong>Clicca qui</strong> per creare un account per la
          tua chiesa.
        </Link>
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(loginFunction)(e);
        }}
        noValidate
        className="mt-8 space-y-4"
      >
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            {...register("email")}
            required
            type="email"
            id="email"
            name="email"
            placeholder="email..."
            minLength={8}
            className="cinput"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <input
              {...register("password")}
              required
              type={isVisible ? "text" : "password"}
              id="password"
              name="password"
              placeholder="password..."
              minLength={8}
              className="cinput"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit(loginFunction)();
                }
              }}
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
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 text-white rounded-md bg-black hover:bg-gray-800 transition ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Caricamento..." : "Accedi"}
        </button>

        {error && (
          <div className="flex items-center gap-2 rounded-md bg-red-100 p-3 text-sm text-red-800 border border-red-300">
            <GrCircleAlert />

            <p>{error}</p>
          </div>
        )}

        <Link
          href="/forgot-password"
          className="text-center block text-sm text-gray-600"
        >
          Password dimenticata?{" "}
          <strong className="underline">Clicca qui</strong>
        </Link>
      </form>
    </div>
  );
}
