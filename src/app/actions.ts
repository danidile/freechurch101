"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { TauthSchema, TlostPasswordSchema } from "@/utils/types/auth";
import { TresetPasswordSchema } from "@/utils/types/auth";
import { translateSupabaseError } from "@/utils/supabase/translateSupabaseError";

export const signUpAction = async (data: TauthSchema) => {
  const email = data.email;
  const password = data.password;
  const supabase = createClient();

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error(error.code + " " + error.message);

    return encodedRedirect(
      "error",
      "/sign-up",
      translateSupabaseError(error.message)
    );
  } else {
    return encodedRedirect(
      "success",
      "/login",
      "Registrazione effettuata con successo! Controlla la tua mail per il link di verifica. "
    );
  }
};

export const resetPasswordAction = async (data: TresetPasswordSchema) => {
  const supabase = createClient();

  const password = data.password;
  const confirmPassword = data.confirmPassword;

  if (!password || !confirmPassword) {
    console.log("password o confirm password mancanti");
  }

  if (password !== confirmPassword) {
    console.log("password o confirm password non uguali");
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return {
      sucess: false,
      message: error.message,
    };
  }
  return {
    sucess: true,
    message: "password aggiornata con successo",
  };
};

export const signOutAction = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export default async function userData() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return data;
}

export async function logout() {
  console.log("working till here");
  const supabase = createClient();

  await supabase.auth.signOut();

  redirect("/auth");
}
