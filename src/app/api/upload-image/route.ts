// app/api/upload-image/route.ts
import { createClient } from "@/utils/supabase/server";
import { logEvent } from "@/utils/supabase/log";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let supabase;

  try {
    supabase = await createClient();
  } catch (err) {
    console.error("Failed to create Supabase client:", err);
    return NextResponse.json(
      { success: false, error: "Database connection failed" },
      { status: 500 }
    );
  }

  try {
    // 1. First check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    try {
      await logEvent({
        event: "upload_debug_auth_check",
        level: "info",
        meta: {
          hasUser: !!user,
          userId: user?.id,
          authError: authError?.message,
          environment: process.env.NODE_ENV,
        },
      });
    } catch (logErr) {
      console.error("Failed to log auth check:", logErr);
    }

    if (authError || !user) {
      await logEvent({
        event: "upload_image_action_unauthorized",
        level: "error",
        meta: { authError: authError?.message, hasUser: !!user },
      });
      return NextResponse.json(
        { success: false, error: "Unauthorized - no valid session" },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const userId = formData.get("userId") as string;
    const type = formData.get("type") as "profilepicture" | "churchlogo";
    const file = formData.get("file") as File;

    await logEvent({
      event: "upload_debug_form_data",
      level: "info",
      meta: {
        userId,
        type,
        fileName: file?.name,
        fileSize: file?.size,
        authenticatedUserId: user.id,
      },
    });

    if (!userId || !file || !type) {
      await logEvent({
        event: "upload_image_action_missing_fields",
        level: "error",
        meta: { userId, type, hasFile: !!file },
      });
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify the userId matches the authenticated user
    if (userId !== user.id) {
      await logEvent({
        event: "upload_image_action_user_mismatch",
        level: "error",
        meta: { providedUserId: userId, authenticatedUserId: user.id },
      });
      return NextResponse.json(
        { success: false, error: "User ID mismatch" },
        { status: 403 }
      );
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      await logEvent({
        event: "upload_file_too_large",
        level: "error",
        meta: { userId, fileSize: file.size, type },
      });
      return NextResponse.json(
        { success: false, error: "File too large. Maximum size is 2MB." },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      await logEvent({
        event: "upload_invalid_file_type",
        level: "error",
        meta: { userId, fileType: file.type, type },
      });
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file type. Only images are allowed.",
        },
        { status: 400 }
      );
    }

    const extension = file.name.split(".").pop() ?? "jpg";
    const contentType = file.type;

    if (type === "profilepicture") {
      const avatarPath = `${userId}/avatar.${extension}`;

      await logEvent({
        event: "upload_debug_attempting_avatar_upload",
        level: "info",
        meta: { userId, avatarPath, contentType },
      });

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
          meta: {
            userId,
            avatarPath,
            message: avatarErr.message,
            details: avatarErr,
          },
        });
        return NextResponse.json(
          {
            success: false,
            error: `Upload error (avatar): ${avatarErr.message}`,
          },
          { status: 500 }
        );
      }

      await logEvent({
        event: "upload_profilepicture_success",
        level: "info",
        meta: { userId, avatarPath },
      });

      // Update database
      const { error: dbErr } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarPath })
        .eq("id", userId);

      if (dbErr) {
        await logEvent({
          event: "upload_profilepicture_db_update_failed",
          level: "error",
          meta: {
            userId,
            message: dbErr.message,
            code: dbErr.code,
            details: dbErr,
          },
        });
        return NextResponse.json(
          { success: false, error: `DB update error: ${dbErr.message}` },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    }

    if (type === "churchlogo") {
      await logEvent({
        event: "upload_debug_attempting_church_fetch",
        level: "info",
        meta: { userId },
      });

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("church")
        .eq("id", userId)
        .single();

      await logEvent({
        event: "upload_debug_church_fetch_result",
        level: "info",
        meta: {
          userId,
          hasProfile: !!profile,
          churchId: profile?.church,
          error: error?.message,
        },
      });

      if (error || !profile?.church) {
        await logEvent({
          event: "upload_churchlogo_profile_fetch_failed",
          level: "error",
          meta: {
            userId,
            message: error?.message || "No church found",
            code: error?.code,
            profile,
          },
        });
        return NextResponse.json(
          { success: false, error: "Profile or church not found" },
          { status: 404 }
        );
      }

      const logoPath = `${profile.church}/logo.${extension}`;

      await logEvent({
        event: "upload_debug_attempting_logo_upload",
        level: "info",
        meta: { churchId: profile.church, logoPath, contentType },
      });

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
            details: uploadErr,
          },
        });
        return NextResponse.json(
          {
            success: false,
            error: `Upload error (churchlogo): ${uploadErr.message}`,
          },
          { status: 500 }
        );
      }

      const { error: dbErr } = await supabase
        .from("churches")
        .update({ logo: logoPath })
        .eq("id", profile.church);

      if (dbErr) {
        await logEvent({
          event: "upload_churchlogo_db_update_failed",
          level: "error",
          meta: {
            churchId: profile.church,
            message: dbErr.message,
            code: dbErr.code,
            details: dbErr,
          },
        });
        return NextResponse.json(
          { success: false, error: `DB update error: ${dbErr.message}` },
          { status: 500 }
        );
      }

      await logEvent({
        event: "upload_churchlogo_success",
        level: "info",
        meta: { churchId: profile.church, logoPath },
      });

      return NextResponse.json({ success: true });
    }

    await logEvent({
      event: "upload_invalid_type",
      level: "error",
      meta: { userId, type },
    });
    return NextResponse.json(
      { success: false, error: "Unsupported upload type" },
      { status: 400 }
    );
  } catch (err) {
    const error = err as Error;
    console.error("Upload action failed:", error);

    try {
      await logEvent({
        event: "upload_image_action_failed",
        level: "error",
        meta: {
          error: error.message,
          stack: error.stack,
          environment: process.env.NODE_ENV,
        },
      });
    } catch (logErr) {
      console.error("Failed to log error:", logErr);
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
