"use server";

import { createClient } from "@/utils/supabase/server";
import { translateSupabaseError } from "@/utils/supabase/translateSupabaseError";
import { registrationData, ServerActionResponse } from "@/utils/types/types";

export const loginAction = async (
  formData: registrationData
): Promise<ServerActionResponse<{ user: any; session: any }>> => {
  const { email, password } = formData;
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

  return {
    success: true,
    data,
  };
};
