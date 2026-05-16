"use server";

import { logEvent } from "@/utils/supabase/log";
import { createClient } from "@/utils/supabase/server";
import { translateSupabaseError } from "@/utils/supabase/translateSupabaseError";
import { registrationData, ServerActionResponse } from "@/utils/types/types";

export const inviteRegristrationAction = async (
  formData: registrationData
): Promise<ServerActionResponse<{ user: any; session: any }>> => {
  const supabase = await createClient();

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
      await logEvent({
        event: "invite_registration_error_fetching_invite",
        meta: { error: error.message, email },
        level: "error",
      });
      return;
    } else if (!pending_invites || pending_invites.length === 0) {
      console.log("No pending invite found for this token.");
      await logEvent({
        event: "invite_registration_invalid_token",
        meta: {
          token: formData.token,
          email,
          message: "No pending invite found for this token.",
        },
        level: "warn",
      });
      return null;
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
        await logEvent({
          event: "invite_registration_signup_failed",
          meta: { error: error.message, email },
          level: "error",
        });
        return { success: false, error: errorMessage };
      } else {
        console.log("Utente registrato con successo");

        await logEvent({
          event: "invite_registration_successful_signup",
          user_id: data.user.id,
          meta: { email },
        });

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
            await logEvent({
              event: "invite_registration_profile_update_failed",
              user_id: data.user.id,
              meta: { error: profileDataError.message },
              level: "error",
            });
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
            console.error(updatedInviteError);
            await logEvent({
              event: "invite_registration_invite_update_failed",
              user_id: data.user.id,
              meta: { error: updatedInviteError.message },
              level: "error",
            });
            return {
              success: false,
              error: "Errore nell'aggiornamento del invito.",
            };
          } else {
            console.log("invito Aggiornato con successo");
            await logEvent({
              event: "invite_registration_invite_confirmed",
              user_id: data.user.id,
              meta: { email },
            });
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
    await logEvent({
      event: "invite_registration_missing_token",
      meta: { email },
      level: "warn",
    });
    return { success: false, error: "Token Necessario" };
  }
};
