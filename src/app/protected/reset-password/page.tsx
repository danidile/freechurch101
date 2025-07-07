"use client";

import { resetPasswordAction } from "@/app/actions";
import { Input, Button, Alert } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TresetPasswordSchema, resetPasswordSchema } from "@/utils/types/auth";
import { useState } from "react";

export default function ResetPasswordComponent() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TresetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });
  const [passwordResetted, setPasswordReset] = useState<boolean>(false);
  const convertData = async (data: TresetPasswordSchema) => {
    console.log(data);
    resetPasswordAction(data);
    console.log(data);
    setPasswordReset(true);
  };

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
