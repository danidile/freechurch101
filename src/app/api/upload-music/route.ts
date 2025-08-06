// app/api/upload-music/route.ts
import { createClient } from "@/utils/supabase/server";
import { logEvent } from "@/utils/supabase/log";
import { NextRequest, NextResponse } from "next/server";
import userDataServer from "@/utils/supabase/getUserDataServer";

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
    const userdData = await userDataServer();
    if (!userdData.id) {
      await logEvent({
        event: "upload_music_unauthorized",
        level: "error",
      });
      return NextResponse.json(
        { success: false, error: "Unauthorized - no valid session" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const userId = formData.get("userId") as string;
    const file = formData.get("file") as File;
    const songId = formData.get("songId") as string;
    console.log("[upload-music] POST called");
    console.log("userId", userId);
    console.log("file", file);
    if (!userId || !file) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (userId !== userdData.id) {
      return NextResponse.json(
        { success: false, error: "User ID mismatch" },
        { status: 403 }
      );
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    // Validate type
    if (!file.type.startsWith("audio/")) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file type. Only audio files are allowed.",
        },
        { status: 400 }
      );
    }

    const originalName = file.name.replace(/\s+/g, "_"); // replace spaces with underscores

    const contentType = file.type;
    const audioPath = `${userdData.church_id}/music/audio/${songId}/${originalName}`;

    const { error: uploadErr } = await supabase.storage
      .from("churchdata")
      .upload(audioPath, file, {
        upsert: true,
        contentType,
        cacheControl: "no-cache",
      });

    if (uploadErr) {
      await logEvent({
        event: "upload_music_failed",
        level: "error",
        meta: {
          userId,
          audioPath,
          message: uploadErr.message,
          details: uploadErr,
        },
      });
      return NextResponse.json(
        { success: false, error: `Upload error: ${uploadErr.message}` },
        { status: 500 }
      );
    } else {
      const { data, error } = await supabase
        .from("songs")
        .update({ audio_path: true })
        .eq("id", songId)
        .select();
      if (error) {
        await logEvent({
          event: "Update_song_table_after_upload_music_failed",
          level: "error",
          meta: {
            userId,
            audioPath,
            message: error.message,
            details: error,
          },
        });
      }
    }

    await logEvent({
      event: "upload_music_success",
      level: "info",
      meta: { userId, audioPath },
    });

    return NextResponse.json({ success: true, path: audioPath });
  } catch (err) {
    const error = err as Error;
    console.error("Upload failed:", error);

    await logEvent({
      event: "upload_music_action_failed",
      level: "error",
      meta: {
        message: error.message,
        stack: error.stack,
      },
    });

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
