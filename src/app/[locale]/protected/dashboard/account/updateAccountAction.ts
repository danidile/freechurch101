"use server";

import { createClient } from "@/utils/supabase/server";

export async function updateAccountAction(data: {
  name: string;
  lastname: string;
  phone: string;
  email: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { success: false, error: "Utente non autenticato." };
  }

  // update profile table
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      name: data.name,
      lastname: data.lastname,
      phone: data.phone,
    })
    .eq("auth_id", user?.id)

  if (profileError) {
    return { success: false, error: profileError.message };
  }

  // update email separately if changed (requires Supabase email verification)
  if (data.email !== user.email) {
    const { error: emailError } = await supabase.auth.updateUser({
      email: data.email,
    });
    if (emailError) {
      return { success: false, error: emailError.message };
    }
  }

  return { success: true, error: null };
}
