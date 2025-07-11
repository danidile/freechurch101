"use client";

import { FormMessage } from "@/app/components/form-message";
import { Input, Button, Spinner } from "@heroui/react";
import { TlostPasswordSchema, lostPasswordSchema } from "@/utils/types/auth";
import { TalertMessage } from "@/utils/types/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Link from "next/link";
import { Alert } from "@heroui/alert";
import forgotPasswordAction from "./forgotPasswordAction";

export default function ForgotPassword({
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
  };
  if (error) {
    return (
      <div className="container-sub">
        <div className="auth-form max-w-[400px]">
          <div className="flex items-center justify-center w-full">
            <Alert color="danger" title={error} />
          </div>
        </div>
      </div>
    );
  } else if (emailSent) {
    return (
      <div className="container-sub">
        <h1 className="text-2xl font-medium">Reset Password</h1>
        <div className="auth-form max-w-[400px]">
          <div className="flex items-center justify-center w-full">
            <Alert
              color="success"
              description="Tra poco riceverai una mail con le istruzioni per recuperare la tua password. Se non dovessi trovarla nella casella principale controlla la spam."
              title="Email di recupero inviata."
            />
          </div>
        </div>
      </div>
    );
  } else if (!emailSent) {
    return (
      <div className="container-sub">
        <form
          onSubmit={handleSubmit(convertData)}
          className="auth-form max-w-[400px]"
        >
          <h1 className="text-2xl font-medium">Reset Password</h1>
          <div className="flex flex-col gap-5 [&>input]:mb-3 mt-8">
            <p>Inserisci la tua Email.</p>
            <Input
              variant="underlined"
              {...register("email")}
              label="Email"
              name="email"
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
              disabled={sending}
              fullWidth
              className=" bg-black"
            >
              {sending ? <Spinner color="white" /> : "Invia"}
            </Button>
          </div>
        </form>
        <Link href="/login" className="underline ">
          <small>Torna alla pagina di login</small>
        </Link>
      </div>
    );
  }
}
