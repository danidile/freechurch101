"use server";

import { createClient } from "@/utils/supabase/server";
import { translateSupabaseError } from "@/utils/supabase/translateSupabaseError";
import { registrationData } from "@/utils/types/types";

export const regristrationAction = async (formData: registrationData) => {
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
    return { success: false, error: errorMessage };
  }

  if (data?.user?.id) {
    // Update profile

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
      return {
        success: false,
        error: "Errore nella creazione della nuova chiesa.",
      };
    }

    const newChurchId = newChurch?.[0]?.id;
    const { data: profileData, error: profileDataError } = await supabase
      .from("profiles")
      .update({
        name: firstName,
        lastname: lastName,
        church: newChurchId,
        role: 1,
      })
      .eq("id", data.user.id)
      .select();

    if (profileDataError) {
      console.error(profileDataError);
      return {
        success: false,
        error: "Errore nell'aggiornamento del profilo.",
      };
    }
    const { data: roomData, error: errorRoom } = await supabase
      .from("rooms")
      .insert({
        name: formData.room_name,
        church: newChurchId,
        address: formData.address,
        comune: formData.comune,
      })
      .select();

    if (errorRoom) {
      console.error(errorRoom);
      return {
        success: false,
        error: "Errore nella creazione della stanza.",
      };
    }

    return { success: true };
  } else {
    console.warn("USER NOT CREATED.");
    return { success: false, error: "Utente non creato." };
  }
};
