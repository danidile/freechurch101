"use server";

import { createClient } from "@/utils/supabase/server";
import { translateSupabaseError } from "@/utils/supabase/translateSupabaseError";
import { TlostPasswordSchema } from "@/utils/types/auth";
import { ServerActionResponse } from "@/utils/types/types";

const forgotPasswordAction = async (
  data: TlostPasswordSchema
): Promise<ServerActionResponse<null>> => {
  const email = data.email;
  const supabase = createClient();

  if (!email) {
    return {
      success: false,
      error: "Errore: Email richiesta.",
    };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `https://churchlab.it/protected/reset-password`,
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
