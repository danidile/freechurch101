"use server";

import { createClient } from "@/utils/supabase/server";
import { translateSupabaseError } from "@/utils/supabase/translateSupabaseError";
import {
  loginData,
  ServerActionResponse,
} from "@/utils/types/types";

export const loginAction = async (
  formData: loginData
): Promise<ServerActionResponse<{ user: any; session: any }>> => {
  const { email, password } = formData;

  if (!email || !password) {
    return {
      success: false,
      error: "Email e password sono obbligatorie.",
    };
  }

  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      error: translateSupabaseError(error.message),
    };
  }

  // Sanity check: make sure user and session exist
  if (!data?.user || !data?.session) {
    return {
      success: false,
      error: "Accesso non riuscito. Riprova più tardi.",
    };
  }

  return {
    success: true,
    data: {
      user: data.user,
      session: data.session,
    },
  };
};
