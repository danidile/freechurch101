"use server";
import { basicUserData } from "@/utils/types/userData";
import { createClient } from "@/utils/supabase/server";

export const completeAccountAction = async function completeAccountAction(
  data: basicUserData
) {
  const supabase = createClient();

  const updateData: { name?: string; lastname?: string } = {};

  if (data.name && data.name.length > 2) {
    updateData.name = data.name;
  }

  if (data.lastname && data.lastname.length > 2) {
    updateData.lastname = data.lastname;
  }

  // Only update if there's something to update
  if (Object.keys(updateData).length > 0) {
    const { error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", data.id)
      .select();

    if (error) {
      console.error("Update error:", error);
    }
  } else {
    console.log("No fields met the update criteria.");
  }

  if (data.church_id) {
    const { data: dataChurch, error: churchDataError } = await supabase
      .from("church-membership-request")
      .insert({
        church: data.church_id,
        profile: data.id,
      })
      .select();
    if (churchDataError) {
      console.error(churchDataError.message);
    }
  }
};
