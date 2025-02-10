"use client";

import { FormMessage } from "@/app/components/form-message";

import { signUpAction } from "@/app/actions";
import { Input, Button } from "@heroui/react";
import Link from "next/link";
import { authSchema, TauthSchema } from "@/utils/types/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TalertMessage } from "@/utils/types/types";

export default function Signup({
  searchParams,
}: {
  searchParams: TalertMessage;
}) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TauthSchema>({
    resolver: zodResolver(authSchema),
  });

  const convertData = async (data: TauthSchema) => {
    console.log(data);
    signUpAction(data);
    console.log(data);
  };

  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
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
      </div>
    );
  }

  return (
    <div className="container-sub">
      <form className="auth-form" onSubmit={handleSubmit(convertData)}>
        <h1 className="text-2xl font-medium">Registrati</h1>

        <p className="text-sm text text-foreground">
          Hai già un account?
          <Link className="text-foreground font-medium underline" href="/login">
            Accedi
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Input
            {...register("email")}
            label="Email"
            name="email"
            placeholder="you@example.com"
            required
          />
          <Input
            {...register("password")}
            label="Password"
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
          />
          <Button
            color="primary"
            variant="shadow"
            type="submit"
            disabled={isSubmitting}
          >
            Registrati
          </Button>
        </div>
      </form>
    </div>
  );
}
