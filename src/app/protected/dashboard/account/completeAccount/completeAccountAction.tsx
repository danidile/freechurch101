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
      lastname: data.lastname || null,
    })
    .eq("id", data.id)
    .select();
  if (data.church_id) {
    const { data: dataChurch, error: churchDataError } = await supabase
      .from("church-membership-request")
      .insert({
        church: data.church_id,
        profile: data.id,
      })
      .select();
    if (churchDataError) {
      console.error(error.code + " " + churchDataError.message);
    }
  }
  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } 
};
