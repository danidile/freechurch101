"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import { useUserStore } from "@/store/useUserStore";
import { uploadImageAction } from "./uploadImageAction";
import { prepareImageUpload } from "./uploadImageClient";

export default function ImageUploader({
  type,
}: {
  type?: "profilepicture" | "churchlogo";
}) {
  const { userData, fetchUser, loading } = useUserStore();
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
    if (!type) {
      setError("Tipo di upload non specificato.");
      return;
    }
    if (file) {
      const processed = await prepareImageUpload(file, type);

      await uploadImageAction(processed, userData.id);
      setPreviewUrl(null);
      setFile(null);
      fetchUser();
    }
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
