"use server";

import { createClient } from "@/utils/supabase/server";
import { translateSupabaseError } from "@/utils/supabase/translateSupabaseError";
import { TlostPasswordSchema } from "@/utils/types/auth";
import { ServerActionResponse } from "@/utils/types/types";

const forgotPasswordAction = async (
  data: TlostPasswordSchema
): Promise<ServerActionResponse<null>> => {
  const email = data.email;
  const supabase = await createClient();

  if (!email) {
    return {
      success: false,
      error: "Errore: Email richiesta.",
    };
  }
  const redirectTo =
    process.env.NODE_ENV !== "development"
      ? "https://churchlab.it/reset-password"
      : "http://localhost:3000/reset-password";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
  if (error) {
    console.log(error);
    return {
      success: false,
      error: translateSupabaseError(error.message),
    };
  }

  return {
    success: true,
    message: "Email inviata con successo. Controlla la tua email.",
  };
};

export default forgotPasswordAction;
