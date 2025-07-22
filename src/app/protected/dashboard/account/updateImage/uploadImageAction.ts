"use server";
import { createClient } from "@/utils/supabase/server";
import { logEvent } from "@/utils/supabase/log";

type UploadPayload =
  | {
      type: "profilepicture";
      main: Blob;
      thumb: Blob;
      extension: string;
      contentType: string;
    }
  | {
      type: "churchlogo";
      main: Blob;
      extension: string;
      contentType: string;
    };

export async function uploadImageAction(
  processed: UploadPayload,
  userId: string
) {
  const supabase = await createClient();

  try {
    if (processed.type === "profilepicture") {
      const avatarPath = `${userId}/avatar.${processed.extension}`;
      const thumbPath = `${userId}/avatar_thumb.${processed.extension}`;

      const { error: avatarErr } = await supabase.storage
        .from("avatars")
        .upload(avatarPath, processed.main, {
          upsert: true,
          contentType: processed.contentType,
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

      const { error: thumbErr } = await supabase.storage
        .from("avatars")
        .upload(thumbPath, processed.thumb, {
          upsert: true,
          contentType: processed.contentType,
          cacheControl: "no-cache",
        });

      if (thumbErr) {
        await logEvent({
          event: "upload_profilepicture_thumb_failed",
          level: "error",
          meta: { userId, thumbPath, message: thumbErr.message },
        });
        throw new Error(`Upload error (thumbnail): ${thumbErr.message}`);
      }

      await logEvent({
        event: "upload_profilepicture_success",
        level: "info",
        meta: { userId, avatarPath, thumbPath },
      });

      return { success: true };
    }

    if (processed.type === "churchlogo") {
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

      const logoPath = `${profile.church}/logo.${processed.extension}`;

      const { error: uploadErr } = await supabase.storage
        .from("churchlogo")
        .upload(logoPath, processed.main, {
          upsert: true,
          contentType: processed.contentType,
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
      meta: { userId, type: processed },
    });
    throw new Error("Unsupported upload type");
  } catch (err) {
    await logEvent({
      event: "upload_image_action_failed",
      level: "error",
      meta: { userId, error: (err as Error).message },
    });
    throw err;
  }
}
