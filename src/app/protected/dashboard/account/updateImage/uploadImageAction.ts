// src/app/actions/uploadImageAction.ts
"use server";
import { createClient } from "@/utils/supabase/server";

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

    if (avatarErr)
      throw new Error(`Upload error (avatar): ${avatarErr.message}`);

    const { error: thumbErr } = await supabase.storage
      .from("avatars")
      .upload(thumbPath, processed.thumb, {
        upsert: true,
        contentType: processed.contentType,
        cacheControl: "no-cache",
      });

    if (thumbErr)
      throw new Error(`Upload error (thumbnail): ${thumbErr.message}`);

    return { success: true };
  }

  if (processed.type === "churchlogo") {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("church")
      .eq("id", userId)
      .single();

    if (error || !profile?.church)
      throw new Error("Profile or church not found");

    const logoPath = `${profile.church}/logo.${processed.extension}`;

    const { error: uploadErr } = await supabase.storage
      .from("churchlogo")
      .upload(logoPath, processed.main, {
        upsert: true,
        contentType: processed.contentType,
        cacheControl: "no-cache",
      });

    if (uploadErr)
      throw new Error(`Upload error (churchlogo): ${uploadErr.message}`);

    const { error: dbErr } = await supabase
      .from("churches")
      .update({ logo: logoPath })
      .eq("id", profile.church);

    if (dbErr) throw new Error(`DB update error: ${dbErr.message}`);

    return { success: true };
  }

  throw new Error("Unsupported upload type");
}
