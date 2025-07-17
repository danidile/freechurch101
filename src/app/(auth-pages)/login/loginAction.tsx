"use server";

import { logEvent } from "@/utils/supabase/log";
import { createClient } from "@/utils/supabase/server";
import { translateSupabaseError } from "@/utils/supabase/translateSupabaseError";
import { loginData, ServerActionResponse } from "@/utils/types/types";

export const loginAction = async (
  formData: loginData
): Promise<ServerActionResponse<{ user: any; session: any }>> => {
  const { email, password } = formData;

  if (!email || !password) {
    // Skip logging this kind of client-side error
    return {
      success: false,
      error: "Email e password sono obbligatorie.",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Log only actual Supabase auth errors
    await logEvent({
      event: "login_error",
      level: "error",
      meta: {
        email,
        message: error.message,
        status: error.status,
      },
    });

    return {
      success: false,
      error: translateSupabaseError(error.message),
    };
  }

  if (!data?.user || !data?.session) {
    // Log unexpected auth behavior
    await logEvent({
      event: "login_no_user_session",
      level: "error",
      meta: { email },
    });

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
