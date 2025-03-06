"use server";
import { basicUserData } from "@/utils/types/userData";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";

export const completeAccountAction = async function completeAccountAction(
  data: basicUserData
) {
  const supabase = createClient();
  if (!data) {
    return { error: "Email and password are required" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      name: data.name,
      lastname: data.lastname,
    })
    .eq("id", data.id)
    .select();

  const { data: dataChurch, error: churchDataError } = await supabase
    .from("church-membership-request")
    .insert({
      church: data.church_id,
      profile: data.id,
    })
    .select();

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      `/protected/dashboard`,
      "Thanks for signing up! Please check your email for a verification link."
    );
  }
};
