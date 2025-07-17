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
  const supabase = await createClient();

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
  const supabase = await createClient();

  const password = data.password;
  const confirmPassword = data.confirmPassword;

  if (!password || !confirmPassword) {
    console.log("password o confirm password mancanti");
    return {
      success: false,
      message: "password o confirma password mancanti",
    };
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      message: "Le password devono essere uguali.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }
  return {
    success: true,
    message: "password aggiornata con successo",
  };
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export default async function userData() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return data;
}

export async function logout() {
  console.log("working till here");
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect("/auth");
}
