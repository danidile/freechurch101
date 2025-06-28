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


export const forgotPasswordAction = async (data: TlostPasswordSchema) => {
  const email = data.email;
  const supabase = createClient();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `https://churchlab.it/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Controlla la tu Mail per il link per reimpostare la password. "
  );
};

export const resetPasswordAction = async (data: TresetPasswordSchema) => {
  const supabase = createClient();

  const password = data.password;
  const confirmPassword = data.confirmPassword;

  if (!password || !confirmPassword) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      "success",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  return encodedRedirect(
    "success",
    "/protected/reset-password",
    "Password updated"
  );
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
