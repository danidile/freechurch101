"use client";

import { forgotPasswordAction } from "@/app/actions";
import { FormMessage } from "@/app/components/form-message";
import { Input, Button } from "@heroui/react";
import { TlostPasswordSchema, lostPasswordSchema } from "@/utils/types/auth";
import { TalertMessage } from "@/utils/types/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Link from "next/link";
import { Alert } from "@heroui/alert";

export default function ForgotPassword({
  searchParams,
}: {
  searchParams: TalertMessage;
}) {
  const [emailSent, setEmailSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TlostPasswordSchema>({
    resolver: zodResolver(lostPasswordSchema),
  });

  const convertData = async (data: TlostPasswordSchema) => {
    setEmailSent(true);
    await forgotPasswordAction(data);
    setEmailSent(true);
  };
  if (!emailSent) {
    return (
      <div className="container-sub">
        <form
          onSubmit={handleSubmit(convertData)}
          className="auth-form max-w-[400px]"
        >
          <h1 className="text-2xl font-medium">Reset Password</h1>
          <div className="flex flex-col gap-5 [&>input]:mb-3 mt-8">
            <p>Inserisci l'e-mail per cercare il tuo accont.</p>
            <Input
              {...register("email")}
              label="Email"
              name="email"
              placeholder="you@example.com"
              required
            />
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

            <Button
              color="primary"
              variant="shadow"
              type="submit"
              disabled={isSubmitting}
              fullWidth
            >
              Invia
            </Button>
          </div>
        </form>
        <Link href="/login" className="underline text-blue-600">
          Torna alla pagina di login
        </Link>
      </div>
    );
  } else {
    return (
      <div className="container-sub">
        <h1 className="text-2xl font-medium">Reset Password</h1>
        <div className="auth-form max-w-[400px]">
          <div className="flex items-center justify-center w-full">
            <Alert
              description="Tra poco riceverai una mail con le istruzioni per recuperare la tua password. Se non dovessi trovarla nella casella principale controlla la spam."
              title="Email di recupero inviata."
            />
          </div>
        </div>
      </div>
    );
  }
}
