"use client"; 

import { signUpAction } from "@/app/actions";
import { Input, Button } from "@nextui-org/react";
import Link from "next/link";
import { authSchema, TauthSchema } from "@/utils/types/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';


export default function Signup({ searchParams }: { searchParams: Message }) {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TauthSchema>({
    resolver: zodResolver(authSchema),
  });

  const convertData = async (data: TauthSchema) =>{
    console.log(data);
    signUpAction(data);
    console.log(data);
  }



  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <form className="flex flex-col min-w-64 max-w-64 mx-auto" onSubmit={handleSubmit(convertData)}>
        <h1 className="text-2xl font-medium">Registrati</h1>
        <p className="text-sm text text-foreground">
          Non hai un account?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Accedi
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Input 
          {...register("email",)}
          label="Email" name="email" placeholder="you@example.com" required />
          <Input
          {...register("password",)}
          label="Password"
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
          />
          <Button color="primary" variant="shadow" type='submit' disabled={isSubmitting}>
            Registrati
          </Button>
        </div>
      </form>
    </>
  );
}
