"use server";

import { createClient } from "@/utils/supabase/server";
import { translateSupabaseError } from "@/utils/supabase/translateSupabaseError";
import { registrationData, ServerActionResponse } from "@/utils/types/types";

export const inviteRegristrationAction = async (
  formData: registrationData
): Promise<ServerActionResponse<{ user: any; session: any }>> => {
  const supabase = createClient();

  const { email, password, firstName, lastName, church } = formData;

  if (password.length <= 7) {
    return {
      success: false,
      error: "Password troppo corta.",
    };
  }
  if (formData?.token) {
    let { data: pending_invites, error } = await supabase
      .from("pending_invites")
      .select("*")
      .eq("token", formData.token)
      .eq("status", "pending")
      .eq("church", formData.church)
      .eq("email", formData.email);
    if (error) {
      console.error("Error fetching invite:", error.message);
      return;
    } else if (!pending_invites || pending_invites.length === 0) {
      console.log("No pending invite found for this token.");
    } else {
      console.log("Invite found:", pending_invites);
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
      } else {
        console.log("Utente registrato con successo");

        if (data?.user?.id) {
          const { data: profileData, error: profileDataError } = await supabase
            .from("profiles")
            .update({
              church: formData.church,
              name: firstName,
              lastname: lastName,
            })
            .eq("id", data.user.id)
            .select();

          if (profileDataError) {
            console.error(profileDataError);
            return {
              success: false,
              error: "Errore nell'aggiornamento del profilo.",
            };
          } else {
            console.log("Profilo Aggiornato con successo");
          }
          const { data: updatedInviteData, error: updatedInviteError } =
            await supabase
              .from("pending_invites")
              .update({
                status: "confirmed",
              })
              .eq("token", formData.token)
              .select();
          if (updatedInviteError) {
            console.error(profileDataError);
            return {
              success: false,
              error: "Errore nell'aggiornamento del invito.",
            };
          } else {
            console.log("invito Aggiornato con successo");
          }
          return {
            success: true,
            error: "Utente registrato con successo.",
          };
        }
      }
    }
  } else {
    console.log("USER NOT CREATED.");
    return { success: false, error: "Token Necessario" };
  }
};
