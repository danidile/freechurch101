"use server";
import { basicUserData } from "@/utils/types/userData";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";

export const createTempProfile = async function createTempProfile(
  data: basicUserData
) {
  const supabase = createClient();
  if (!data) {
    return { error: "Email and password are required" };
  }

  const { error } = await supabase
    .from("temp-profiles")
    .insert({
      id: crypto.randomUUID(),
      name: data.name,
      lastname: data.lastname,
      church: data.church_id,
    })
    .select();

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      `/people`,
      "Profilo temporaneo creato con successo"
    );
  }
};
