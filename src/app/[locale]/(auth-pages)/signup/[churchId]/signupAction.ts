"use server";

import { createClient } from "@/utils/supabase/server";

export async function signupAction(data: {
  name: string;
  lastname: string;
  email: string;
  password: string;
  phone: string;
  birthdate: Date;
  churchId: string;
}) {
  const supabase = await createClient();

  const { data: church, error: churchError } = await supabase
    .from("churches")
    .select("id")
    .eq("id", data.churchId)
    .single();

  if (churchError || !church) {
    return { success: false, error: "Chiesa non trovata. Controlla il link." };
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
        lastname: data.lastname,
        phone: data.phone,
        birthday: data.birthdate.toISOString().split("T")[0],
        church: data.churchId,
      },
    },
  });

  if (authError || !authData.user) {
    console.error("Signup error:", authError);
    return {
      success: false,
      error: authError?.message || "Errore durante la registrazione.",
    };
  }

  return { success: true, error: null };
}
