"use server";

import { createClient } from "@/utils/supabase/server";
import { logEvent } from "@/utils/supabase/log";

export async function uploadImageAction(formData: FormData) {
  const supabase = await createClient();

  const userId = formData.get("userId") as string;
  const type = formData.get("type") as "profilepicture" | "churchlogo";
  const file = formData.get("file") as File;
  console.log("Uploading image:", { userId, type, file });
  if (!userId || !file || !type) {
    await logEvent({
      event: "upload_image_action_missing_fields",
      level: "error",
      meta: { userId, type },
    });
    return { success: false };
  }

  const extension = file.name.split(".").pop() ?? "jpg";
  const contentType = file.type;

  try {
    if (type === "profilepicture") {
      const avatarPath = `${userId}/avatar.${extension}`;

      const { error: avatarErr } = await supabase.storage
        .from("avatars")
        .upload(avatarPath, file, {
          upsert: true,
          contentType,
          cacheControl: "no-cache",
        });

      if (avatarErr) {
        await logEvent({
          event: "upload_profilepicture_avatar_failed",
          level: "error",
          meta: { userId, avatarPath, message: avatarErr.message },
        });
        throw new Error(`Upload error (avatar): ${avatarErr.message}`);
      }

      await logEvent({
        event: "upload_profilepicture_success",
        level: "info",
        meta: { userId, avatarPath },
      });

      const { error: dbErr } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarPath })
        .eq("id", userId);

      if (dbErr) {
        await logEvent({
          event: "upload_profilepicture_db_update_failed",
          level: "error",
          meta: { userId, message: dbErr.message },
        });
        throw new Error(`DB update error: ${dbErr.message}`);
      }

      return { success: true };
    }

    if (type === "churchlogo") {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("church")
        .eq("id", userId)
        .single();

      if (error || !profile?.church) {
        await logEvent({
          event: "upload_churchlogo_profile_fetch_failed",
          level: "error",
          meta: { userId, message: error?.message || "No church found" },
        });
        throw new Error("Profile or church not found");
      }

      const logoPath = `${profile.church}/logo.${extension}`;

      const { error: uploadErr } = await supabase.storage
        .from("churchlogo")
        .upload(logoPath, file, {
          upsert: true,
          contentType,
          cacheControl: "no-cache",
        });

      if (uploadErr) {
        await logEvent({
          event: "upload_churchlogo_failed",
          level: "error",
          meta: {
            churchId: profile.church,
            logoPath,
            message: uploadErr.message,
          },
        });
        throw new Error(`Upload error (churchlogo): ${uploadErr.message}`);
      }

      const { error: dbErr } = await supabase
        .from("churches")
        .update({ logo: logoPath })
        .eq("id", profile.church);

      if (dbErr) {
        await logEvent({
          event: "upload_churchlogo_db_update_failed",
          level: "error",
          meta: { churchId: profile.church, message: dbErr.message },
        });
        throw new Error(`DB update error: ${dbErr.message}`);
      }

      await logEvent({
        event: "upload_churchlogo_success",
        level: "info",
        meta: { churchId: profile.church, logoPath },
      });

      return { success: true };
    }

    await logEvent({
      event: "upload_invalid_type",
      level: "error",
      meta: { userId, type },
    });
    throw new Error("Unsupported upload type");
  } catch (err) {
    await logEvent({
      event: "upload_image_action_failed",
      level: "error",
      meta: { userId, error: (err as Error).message },
    });
    return { success: false };
  }
}
