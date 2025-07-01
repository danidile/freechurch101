"use client";

import { createClient } from "@/utils/supabase/client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import createThumbnail from "./createThumbnail";
import convertImageToJpeg from "./convertImageToJpeg";
import convertImageToPngWithMaxHeight from "./convertImageToWebpWithMaxHeight";
import convertImageToWebpWithMaxHeight from "./convertImageToWebpWithMaxHeight";

export default function ImageUploader({ type }: { type?: string }) {
  const supabase = createClient();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0];
      if (!selectedFile) return;
      setFile(selectedFile);

      // Revoke old URL to avoid memory leaks or confusion
      if (previewUrl) URL.revokeObjectURL(previewUrl);

      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError("");
    },
    [previewUrl]
  );

  const handleUpload = async (): Promise<void> => {
    if (!file) {
      setError("No file selected");
      return;
    }

    setUploading(true);
    setError("");
    if (type === "profilepicture") {
      try {
        const { data: userData, error: authError } =
          await supabase.auth.getUser();
        if (authError) throw new Error(`Auth error: ${authError.message}`);
        if (!userData?.user) throw new Error("User not authenticated");

        console.log("User authenticated:", userData.user);

        // Convert the original file to JPEG blob
        const jpegBlob = await convertImageToJpeg(file);
        console.log("Converted original image to JPEG blob", jpegBlob);

        // Create thumbnail from the JPEG blob (modify createThumbnail to accept Blob)
        let thumbnailBlob;
        try {
          thumbnailBlob = await createThumbnail(jpegBlob);
          console.log("Thumbnail created:", thumbnailBlob);
        } catch (thumbErr) {
          console.error("Thumbnail creation error:", thumbErr);
          throw new Error("Failed to create thumbnail");
        }

        const uid = userData.user.id;
        const avatarPath = `${uid}/avatar.jpg`;
        const thumbPath = `${uid}/avatar_thumb.jpg`;

        // Upload original converted JPEG
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(avatarPath, jpegBlob, {
            upsert: true,
            contentType: "image/jpeg",
            cacheControl: "no-cache",
          });

        if (uploadError)
          throw new Error(`Upload error (avatars): ${uploadError.message}`);
        console.log("Original image uploaded:", avatarPath);

        // Upload thumbnail JPEG
        const { error: thumbUploadError } = await supabase.storage
          .from("avatars")
          .upload(thumbPath, thumbnailBlob, {
            upsert: true,
            contentType: "image/jpeg",
            cacheControl: "no-cache",
          });
        if (thumbUploadError)
          throw new Error(
            `Upload error (thumbnail): ${thumbUploadError.message}`
          );
        console.log("Thumbnail uploaded:", thumbPath);

        setFile(null);
        setPreviewUrl(null);
        setError("");
      } catch (err) {
        console.error("Upload failed:", err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setUploading(false);
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    } else if (type === "churchlogo") {
      try {
        const { data: userData, error: authError } =
          await supabase.auth.getUser();
        if (authError) throw new Error(`Auth error: ${authError.message}`);
        if (!userData?.user) throw new Error("User not authenticated");
        let { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userData.user.id)
          .single();
        if (!profile.church) return null;
        console.log("User authenticated:", userData.user);

        // Determine the file extension and MIME type

        const isPng = file.type === "image/png";

        let finalBlob: Blob;
        let finalExtension: string;
        let contentType: string;

        if (isPng) {
          finalBlob = file;
          finalExtension = "png";
          contentType = "image/png";
        } else {
          finalBlob = await convertImageToWebpWithMaxHeight(file);
          finalExtension = "webp";
          contentType = "image/webp";
        }

        const uid = profile.church;
        const churchLogoPath = `${uid}/logo.${finalExtension}`;

        // Upload original image
        const { error: uploadError } = await supabase.storage
          .from("churchlogo")
          .upload(churchLogoPath, finalBlob, {
            upsert: true,
            contentType,
            cacheControl: "no-cache",
          });

        if (uploadError) {
          throw new Error(`Upload error (churchlogo): ${uploadError.message}`);
        } else {
          console.log("churchlogo updated successfully");
        }

        const logoPath = `${uid}/logo.${finalExtension}`;

        // Save path to DB
        const { data: url, error: errorURL } = await supabase
          .from("churches")
          .update({ logo: logoPath })
          .eq("id", profile.church);
        if (errorURL) {
          throw new Error(`Upload error (churchlogoURL into churches table): ${errorURL.message}`);
        } else {
          console.log("churchlogo URL updated successfully into churches table");
        }
        setFile(null);
        setPreviewUrl(null);
        setError("");
      } catch (err) {
        console.error("Upload failed:", err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setUploading(false);
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    }
    setPreviewUrl(null);
    setFile(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  return (
    <div>
      {!previewUrl && (
        <>
          <div
            {...getRootProps()}
            className="p-6 border-2 border-dashed rounded-xl text-center cursor-pointer hover:border-blue-400 transition"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Rilascia immagine qui</p>
            ) : (
              <p>
                Seleziona e trascina, oppure clicca e seleziona.
                <br />
                <small>
                  Dimensione massima 2MB. Formati accettati JPG e PNG
                </small>
              </p>
            )}
          </div>
        </>
      )}

      {previewUrl && (
        <img
          src={previewUrl}
          alt="preview"
          className="mt-4 max-h-24 mx-auto rounded-md"
        />
      )}

      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Carica Immagine"}
        </button>
      )}

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
}
