"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@heroui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, TresetPasswordSchema } from "@/utils/types/auth";
import { resetPasswordAction } from "../actions";
import { Alert } from "@heroui/alert";
import { Button } from "@heroui/button";

export default function ResetPassword() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1)); // Remove '#'

    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (access_token && refresh_token) {
      supabase.auth
        .setSession({
          access_token,
          refresh_token,
        })
        .then(({ error }) => {
          if (error) {
            console.error("Error setting session:", error.message);
          } else {
            console.log("User session restored");
          }
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TresetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });
  const [passwordResetted, setPasswordReset] = useState<boolean>(false);

  const convertData = async (data: TresetPasswordSchema) => {
    const response = await resetPasswordAction(data);

    setPasswordReset(true);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form
      onSubmit={handleSubmit(convertData)}
      className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4"
    >
      {passwordResetted && (
        <Alert
          title="Password reimpostata."
          description="Da ora potrai accedere con la nuova password."
          color="success"
        />
      )}
      {!passwordResetted && (
        <>
          <h1 className="text-2xl font-medium">Reset password</h1>
          <p className="text-sm text-foreground/60">
            Inserisci la tua nuova password.
          </p>

          <Input
            {...register("password")}
            label="New password"
            type="password"
            name="password"
            placeholder="Nuova password"
            required
          />
          <Input
            {...register("confirmPassword")}
            label="Confirm password"
            type="password"
            name="confirmPassword"
            placeholder="Conferma password"
            required
          />

          <Button
            color="primary"
            variant="shadow"
            type="submit"
            disabled={isSubmitting}
          >
            Reset password
          </Button>
        </>
      )}
    </form>
  );
}
