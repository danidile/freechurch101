"use server";

import { signInAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/server";
import { translateSupabaseError } from "@/utils/supabase/translateSupabaseError";
import { registrationData } from "@/utils/types/types";

export const loginAction = async (formData: registrationData) => {
  
  const response = await signInAction(formData);
  if (response.message) {
    return translateSupabaseError(response.message);
  }
};
