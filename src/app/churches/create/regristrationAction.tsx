"use server";

import { createClient } from "@/utils/supabase/server";
import { translateSupabaseError } from "@/utils/supabase/translateSupabaseError";
import { registrationData } from "@/utils/types/types";

export const regristrationAction = async (
  formData: registrationData,
  isCreatingChurch?: boolean
) => {
  const supabase = createClient();

  const { email, password, firstName, lastName, church } = formData;

  if (password.length <= 7) {
    return { error: "Password troppo corta." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        firstName,
        lastName,
        church,
      },
    },
  });

  if (error) {
    console.error(error);
    const errorMessage = translateSupabaseError(error.message);
    return { error: errorMessage };
  }

  if (data?.user?.id) {
    // Update profile
    const { data: profileData, error: profileDataError } = await supabase
      .from("profiles")
      .update({
        name: firstName,
        lastname: lastName,
      })
      .eq("id", data.user.id)
      .select();

    if (profileDataError) {
      console.error(profileDataError);
      return { error: "Errore nell'aggiornamento del profilo." };
    }

    if (!isCreatingChurch) {
      // Send membership request
      const { data: dataChurch, error: churchDataError } = await supabase
        .from("church-membership-request")
        .insert([
          {
            church,
            profile: data.user.id,
          },
        ])
        .select();

      if (churchDataError) {
        console.error(churchDataError);
        return { error: "Errore nell'invio della richiesta di appartenenza." };
      }
      return { success: true };
    } else {
      // Create new church
      const { data: newChurch, error: newChurchError } = await supabase
        .from("churches")
        .insert([
          {
            church_name: formData.churchName,
            pastor: formData.pastor,
            address: formData.address,
            website: formData.website,
            ig_handle: formData.igHandle,
            provincia: formData.provincia,
            city: formData.city,
            creator: data.user.id,
          },
        ])
        .select();

      if (newChurchError) {
        console.error("Error in creating new church", newChurchError);
        return { error: "Errore nella creazione della nuova chiesa." };
      }

      const newChurchId = newChurch?.[0]?.id;

      const { data: profileDataUpdate, error: profileDataErrorUpdate } =
        await supabase
          .from("profiles")
          .update({
            church: newChurchId,
            role: 1,
          })
          .eq("id", data.user.id)
          .select();

      if (profileDataErrorUpdate) {
        console.error(profileDataErrorUpdate);
        return { error: "Errore nell'aggiornamento del profilo con la nuova chiesa." };
      }

      return { success: true };
    }
  } else {
    console.warn("USER NOT CREATED.");
    return { error: "Utente non creato." };
  }
};
