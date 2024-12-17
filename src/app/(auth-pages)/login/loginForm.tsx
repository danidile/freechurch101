"use client"; 

import { signInAction } from "@/app/actions";
import { FormMessage } from "@/app/components/form-message";
import { Input, Button } from "@nextui-org/react";
import Link from "next/link";
import { authSchema, TauthSchema } from "@/utils/types/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import {TalertMessage} from "@/utils/types/types";



export default function LoginForm({ searchParams }: { searchParams: TalertMessage }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TauthSchema>({
    resolver: zodResolver(authSchema),
  });

  const convertData = async (data: TauthSchema) =>{
    signInAction(data);
  }


  return (
    <form className="flex-1 flex flex-col min-w-96 my-20 shadow-xl p-5 rounded-xl" onSubmit={handleSubmit(convertData)} >
      <h1 className="text-2xl font-medium">Accedi</h1>

      <p className="text-sm text-foreground">
        Non hai un account?{" "}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          Registrati
        </Link>
      </p> 
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Input 
        {...register("email",)}
        
        label="Email" name="email" placeholder="you@example.com" required />
        <div className="flex justify-between items-center">
          <Link
            className="text-xs text-foreground underline"
            href="/forgot-password"
          >
            Hai dimenticato la Password?
          </Link>
        </div>
        <Input
        {...register("password",)}
         label="Password"
          type="password"
          name="password"
          placeholder="Your password"
          required
          
        />
        {searchParams.message && <FormMessage message={{
    message: searchParams.message || searchParams.error || searchParams.success || '',
  }} />}
          

        <Button color="primary" variant="shadow" type='submit' disabled={isSubmitting}>
          Accedi
        </Button>
      </div>
    </form>
  );
}
