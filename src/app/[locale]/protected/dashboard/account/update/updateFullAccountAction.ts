"use server";

import { createClient } from "@/utils/supabase/server";

type UpdateFullAccountInput = {
  name: string;
  lastname: string;
  phone: string | null;
  birthday: string | null;
  baptism_date: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  cap: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  newPassword?: string | null;
};

export async function updateFullAccountAction(data: UpdateFullAccountInput) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "Utente non autenticato." };
  }

  // 1. Update the profile row
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      name: data.name,
      lastname: data.lastname,
      phone: data.phone || null,
      birthday: data.birthday || null,
      baptism_date: data.baptism_date || null,
      address: data.address || null,
      city: data.city || null,
      province: data.province || null,
      cap: data.cap || null,
      emergency_contact_name: data.emergency_contact_name || null,
      emergency_contact_phone: data.emergency_contact_phone || null,
    })
    .eq("auth_id", user.id);

  if (profileError) {
    return { success: false, error: profileError.message };
  }

  // 2. Optionally change the password (logged-in user, no old password needed)
  if (data.newPassword) {
    if (data.newPassword.length < 6) {
      return {
        success: false,
        error: "La password deve contenere almeno 6 caratteri.",
      };
    }
    const { error: passwordError } = await supabase.auth.updateUser({
      password: data.newPassword,
    });
    if (passwordError) {
      return { success: false, error: passwordError.message };
    }
  }

  return { success: true, error: null };
}
