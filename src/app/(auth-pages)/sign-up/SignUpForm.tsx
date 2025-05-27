"use client";
import { FormMessage } from "@/app/components/form-message";
import { signUpAction } from "@/app/actions";
import { Input, Button, Spinner } from "@heroui/react";
import Link from "next/link";
import { authSchema, TauthSchema } from "@/utils/types/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TalertMessage } from "@/utils/types/types";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { redirect } from "next/navigation";
import isLoggedIn from "@/utils/supabase/getuser";

export default function Signup({ loggedIn }: { loggedIn: boolean }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TauthSchema>({
    resolver: zodResolver(authSchema),
  });

  const convertData = async (data: TauthSchema) => {
    console.log(data);
    await signUpAction(data);
    console.log(data);
  };
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  if (loggedIn) {
    redirect("/protected/dashboard");
  } else {
    return (
      <div className="container-sub">
        <form
          className="browser:auth-form standalone:auth-form-pwa"
          onSubmit={handleSubmit(convertData)}
        >
          <h1 className="text-2xl font-medium">Registrati</h1>

          <p className="text-sm text text-foreground">
            Hai già un account?
            <Link
              className="text-foreground font-medium underline"
              href="/login"
            >
              Accedi
            </Link>
          </p>
          <div className="w-80 max-w-screen flex flex-col gap-2 [&>input]:mb-3 mt-8">
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
              name="password"
              placeholder="Your password"
              required
              minLength={8}
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

            <Button
              fullWidth
              color="primary"
              variant="bordered"
              type="submit"
              className="my-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Spinner color="white" size="sm" />
              ) : (
                "Registrati"
              )}
            </Button>
          </div>
        </form>
      </div>
    );
  }
}
