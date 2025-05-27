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
import SignUpForm from "./SignUpForm";

export default async function Signup({
  searchParams,
}: {
  searchParams: TalertMessage;
}) {
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
  const loggedIn = await isLoggedIn();
  if (loggedIn) {
    redirect("/protected/dashboard");
  } else {
    return (
      <div className="container-sub">
        <SignUpForm loggedIn={loggedIn} />
      </div>
    );
  }
}
