"use server";

import { logEvent } from "@/utils/supabase/log";
import { createClient } from "@/utils/supabase/server";
import { translateSupabaseError } from "@/utils/supabase/translateSupabaseError";
import { TauthSchema } from "@/utils/types/auth";

export const regristrationAction = async (formData: TauthSchema) => {
  const supabase = await createClient();

  const { email, password, firstname, lastname } = formData;

  if (password.length <= 7) {
    return { error: "Password troppo corta." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        firstname,
        lastname,
      },
    },
  });

  if (error) {
    console.error(error);
    await logEvent({
      event: "registration_error",
      level: "error",
      meta: { email, message: error.message, status: error.status },
    });
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
          church_name: formData.churchname,
          pastor: formData.pastor,
          address: formData.address,
          website: formData.website,
          ig_handle: formData.ighandle,
          provincia: formData.provincia,
          comune: formData.comune,
          creator: data.user.id,
        },
      ])
      .select();

    if (newChurchError) {
      console.error("Error in creating new church", newChurchError);
      await logEvent({
        event: "registration_error",
        level: "error",
        meta: {
          email,
          message: "Errore nella creazione della nuova chiesa",
          error: newChurchError.message || newChurchError,
        },
      });
      return {
        success: false,
        error: "Errore nella creazione della nuova chiesa.",
      };
    }

    const newChurchId = newChurch?.[0]?.id;
    const { data: profileData, error: profileDataError } = await supabase
      .from("profiles")
      .update({
        name: firstname,
        lastname: lastname,
        church: newChurchId,
        role: 1,
      })
      .eq("id", data.user.id)
      .select();

    if (profileDataError) {
      console.error(profileDataError);
      await logEvent({
        event: "registration_error",
        level: "error",
        meta: {
          email,
          message: "Errore nell'aggiornamento del profilo",
          error: profileDataError.message || profileDataError,
        },
      });
      return {
        success: false,
        error: "Errore nell'aggiornamento del profilo.",
      };
    }
    const { data: roomData, error: errorRoom } = await supabase
      .from("rooms")
      .insert({
        name: "sala principale",
        church: newChurchId,
        address: formData.address,
        comune: formData.comune,
      })
      .select();

    if (errorRoom) {
      console.error(errorRoom);
      await logEvent({
        event: "registration_error",
        level: "error",
        meta: {
          email,
          message: "Errore nella creazione della stanza",
          error: errorRoom.message || errorRoom,
        },
      });
      return {
        success: false,
        error: "Errore nella creazione della stanza.",
      };
    }

    await logEvent({
      event: "registration_success",
      level: "info",
      meta: { email, user_id: data.user.id },
    });

    return { success: true };
  } else {
    console.warn("USER NOT CREATED.");
    await logEvent({
      event: "registration_error",
      level: "warn",
      meta: { email, message: "Utente non creato" },
    });
    return { success: false, error: "Utente non creato." };
  }
};
