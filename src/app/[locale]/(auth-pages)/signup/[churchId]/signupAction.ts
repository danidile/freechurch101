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
        full_name: `${data.name} ${data.lastname}`,
        first_name: data.name,
        last_name: data.lastname,
        phone: data.phone,
        birthdate: data.birthdate.toISOString().split("T")[0],
      },
    },
  });

  if (authError || !authData.user) {
    return {
      success: false,
      error: authError?.message || "Errore durante la registrazione.",
    };
  }

  const { error: memberError } = await supabase
    .from("church_members")
    .insert({
      user_id: authData.user.id,
      church_id: data.churchId,
      status: "pending",
    });

  if (memberError) {
    return {
      success: false,
      error: "Errore durante l'associazione alla chiesa.",
    };
  }

  return { success: true, error: null };
}