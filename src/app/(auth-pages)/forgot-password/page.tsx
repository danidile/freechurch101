"use client"; 


import { forgotPasswordAction } from "@/app/actions";
import { FormMessage } from "@/app/components/form-message";
import { Input, Button } from "@nextui-org/react";

import { TlostPasswordSchema, lostPasswordSchema } from "@/utils/types/auth";
import {TalertMessage} from "@/utils/types/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';

export default function ForgotPassword({ searchParams,}: {searchParams: TalertMessage;}) {

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TlostPasswordSchema>({
    resolver: zodResolver(lostPasswordSchema),
  });

  const convertData = async (data: TlostPasswordSchema) =>{
    console.log(data);
    forgotPasswordAction(data);
    console.log(data);
  }



  return (
    <>
      <form
       onSubmit={handleSubmit(convertData)}
      className="flex-1 flex flex-col w-full gap-2 text-foreground [&>input]:mb-6 min-w-64 max-w-64 mx-auto">
          <h1 className="text-2xl font-medium">Reset Password</h1>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Input
          {...register("email",)}
          label="Email" 
          name="email" 
          placeholder="you@example.com" 
          required />
                    <FormMessage message={searchParams} />

          <Button  color="primary" variant="shadow" type='submit' disabled={isSubmitting}>
            Reset Password
          </Button>
        </div>
      </form>
    </>
  );
}
