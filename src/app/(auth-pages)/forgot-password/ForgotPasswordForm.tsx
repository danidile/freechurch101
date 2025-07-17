"use client";

import { FormMessage } from "@/app/components/form-message";
import { TlostPasswordSchema, lostPasswordSchema } from "@/utils/types/auth";
import { TalertMessage } from "@/utils/types/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Link from "next/link";
import forgotPasswordAction from "./forgotPasswordAction";

export default function ForgotPasswordForm({
  searchParams,
}: {
  searchParams: TalertMessage;
}) {
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TlostPasswordSchema>({
    resolver: zodResolver(lostPasswordSchema),
  });

  const convertData = async (data: TlostPasswordSchema) => {
    setSending(true);
    const response = await forgotPasswordAction(data);
    if (response.success) {
      setEmailSent(true);
    } else {
      setError(response.error);
    }
    setSending(false);
  };

  if (error) {
    return (
      <div className="container-sub">
        <div className="auth-form max-w-[400px] mx-auto p-4">
          <div className="flex items-center justify-center w-full">
            <div className="bg-red-100 text-red-800 p-4 rounded-md w-full text-center font-semibold">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  } else if (emailSent) {
    return (
      <div className="container-sub text-center px-4">
        <h1 className="text-3xl font-semibold mb-2">Email Inviata!</h1>
        <p className="text-gray-700 max-w-md mx-auto mb-6">
          Tra poco riceverai una mail con le istruzioni per recuperare la tua
          password. Se non la trovi nella casella principale, controlla la
          cartella spam.
        </p>
        <Link
          href="/login"
          className="inline-block mt-4 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
        >
          Torna alla pagina di login
        </Link>
      </div>
    );
  }

  return (
    <div className="container-sub px-4">
      <form
        onSubmit={handleSubmit(convertData)}
        className="auth-form max-w-[400px] mx-auto p-4"
      >
        <h1 className="text-3xl font-semibold mb-2 text-center">
          Reset Password
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Inserisci la tua email qui sotto e ti invieremo le istruzioni per
          reimpostare la password.
        </p>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-medium text-gray-700">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            name="email"
            required
            className="cinput"
            placeholder="tuoindirizzo@email.com"
            disabled={sending}
            autoComplete="email"
          />
          <small className="text-gray-500">
            Assicurati di inserire l’email con cui ti sei registrato.
          </small>

          {searchParams.message && (
            <FormMessage
              message={{
                message:
                  searchParams.message ||
                  searchParams.error ||
                  searchParams.success ||
                  "",
              }}
            />
          )}

          <button
            type="submit"
            disabled={sending}
            className={`w-full py-2 px-4 rounded-md text-white bg-black hover:bg-gray-800 transition ${
              sending ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {sending ? (
              <svg
                className="animate-spin h-5 w-5 mx-auto text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              "Invia"
            )}
          </button>
        </div>
      </form>
      <div className="text-center mt-6">
        <Link
          href="/login"
          className="underline text-sm text-gray-700 hover:text-gray-900"
        >
          Torna alla pagina di login
        </Link>
      </div>
    </div>
  );
}
