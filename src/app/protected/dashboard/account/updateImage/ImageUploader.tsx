"use client";

import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

import { useUserStore } from "@/store/useUserStore";
import { uploadImageAction } from "./uploadImageAction";

export default function ImageUploader({
  closeState,
  type,
}: {
  type?: "profilepicture" | "churchlogo";
  closeState?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { userData, fetchUser } = useUserStore();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0];
      if (!selectedFile) return;

      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      fileRef.current = selectedFile;
    },
    [previewUrl]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      if (!type || !userData?.id) {
        setError("Dati mancanti.");
        return;
      }

      if (!fileRef.current) {
        setError("Seleziona un file prima di caricare.");
        return;
      }

      const file = fileRef.current;

      // Log what we're about to send
      console.log("Attempting upload with:", {
        userId: userData.id,
        type,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });

      const formData = new FormData();
      formData.append("userId", userData.id);
      formData.append("type", type);
      formData.append("file", file);

      const result = await uploadImageAction(formData);

      console.log("Upload result:", result);

      if (result?.success) {
        closeState?.(false);
        fetchUser();
      } else {
        // Handle the case where result is returned but indicates failure
        const errorMessage = result?.error || "Errore durante l'upload.";
        setError(errorMessage);
        console.error("Upload failed:", result);
      }
    } catch (err) {
      // This catches when the server action throws an error before returning
      console.error("Upload error caught:", err);

      if (err instanceof Error) {
        // Check if it's a network/fetch error
        if (err.message.includes("fetch")) {
          setError(
            "Errore di connessione. Verifica la tua connessione internet."
          );
        } else if (
          err.message.includes("403") ||
          err.message.includes("Forbidden")
        ) {
          setError("Accesso negato. Prova a effettuare nuovamente il login.");
        } else {
          setError("Errore imprevisto: " + err.message);
        }
      } else {
        setError("Errore sconosciuto durante l'upload.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!type || !userData?.id) {
    return <p className="text-red-500">Errore: dati mancanti.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <button
        type="button"
        onClick={() => closeState?.(false)}
        className="absolute top-1 right-1 text-red-500 hover:text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300 rounded-full p-1 transition"
        aria-label="Chiudi"
      >
        ✕
      </button>

      {!previewUrl && (
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
                Dimensione massima 2MB. Formati accettati .Jpg, .Png, .WebP
              </small>
            </p>
          )}
        </div>
      )}

      {previewUrl && (
        <img
          src={previewUrl}
          alt="preview"
          className="mt-4 max-h-24 mx-auto rounded-md"
        />
      )}

      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-4 mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Caricamento..." : "Carica Immagine"}
      </button>
    </form>
  );
}
