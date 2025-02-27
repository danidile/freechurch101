"use client"; 

import { signInAction } from "@/app/actions";
import { FormMessage } from "@/app/components/form-message";
import { Input, Button } from "@heroui/react";
import Link from "next/link";
import { authSchema, TauthSchema } from "@/utils/types/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import {TalertMessage} from "@/utils/types/types";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";




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
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);


  return (
    <form className="auth-form " onSubmit={handleSubmit(convertData)} >
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
        
        <Input
        {...register("password",)}
         label="Password"
          name="password"
          placeholder="Your password"
          required
          endContent={
            <button
              aria-label="toggle password visibility"
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <FaEyeSlash className="text-xl text-default-400 pointer-events-none" />
              ) : (
                <FaEye className="text-xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}

          
        />
        {searchParams.message && <FormMessage message={{
    message: searchParams.message || searchParams.error || searchParams.success || '',
  }} />}
          
          <div className="flex justify-between items-center">
          <Link
            className="text-xs text-foreground underline py-3"
            href="/forgot-password"
          >
            Hai dimenticato la Password?
          </Link>
        </div>
        <Button color="primary" variant="shadow" type='submit' disabled={isSubmitting}>
          Accedi
        </Button>
      </div>
    </form>
  );
}
