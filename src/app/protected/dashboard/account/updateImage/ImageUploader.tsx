"use client";

import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

import { useUserStore } from "@/store/useUserStore";
import { useChurchStore } from "@/store/useChurchStore";

export default function ImageUploader({
  closeState,
  type,
}: {
  type?: "profilepicture" | "churchlogo";
  closeState?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { userData, fetchUser } = useUserStore();
  const { fetchChurchData } = useChurchStore();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<File | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0];
      if (!selectedFile) return;

      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      fileRef.current = selectedFile;
      setProgress(0);
      setError(null);
    },
    [previewUrl]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const uploadWithProgress = async (formData: FormData): Promise<any> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      abortControllerRef.current = new AbortController();

      // Track upload progress
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );
          setProgress(percentComplete);
        }
      });

      // Handle completion
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (e) {
            reject(new Error("Invalid JSON response"));
          }
        } else {
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            reject(new Error(errorResponse.error || `HTTP ${xhr.status}`));
          } catch (e) {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        }
      });

      // Handle errors
      xhr.addEventListener("error", () => {
        reject(new Error("Network error occurred"));
      });

      // Handle abort
      xhr.addEventListener("abort", () => {
        reject(new Error("Upload cancelled"));
      });

      // Handle timeout
      xhr.addEventListener("timeout", () => {
        reject(new Error("Upload timed out"));
      });

      // Configure request
      xhr.timeout = 30000; // 30 seconds timeout
      xhr.open("POST", "/api/upload-image");

      // Send request
      xhr.send(formData);

      // Store xhr reference for potential cancellation
      abortControllerRef.current.signal.addEventListener("abort", () => {
        xhr.abort();
      });
    });
  };

  const cancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
      setProgress(0);
      setError("Upload cancelled");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setProgress(0);

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

      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        setError("Il file è troppo grande. Dimensione massima: 2MB.");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Formato file non supportato. Usa JPG, PNG o WebP.");
        return;
      }

      console.log("Starting upload:", {
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

      const result = await uploadWithProgress(formData);

      console.log("Upload result:", result);

      if (result?.success) {
        // Give a moment to show 100% completion
        closeState(false);
        if (type === "churchlogo")
          fetchChurchData(userData.church_id, userData.role);
        if (type === "profilepicture") fetchUser();
      } else {
        const errorMessage = result?.error || "Errore durante l'upload.";
        setError(errorMessage);
        setProgress(0);
        console.error("Upload failed:", result);
      }
    } catch (err) {
      console.error("Upload error caught:", err);
      setProgress(0);

      if (err instanceof Error) {
        if (err.message.includes("cancelled")) {
          // Don't show error for cancelled uploads
          return;
        } else if (err.message.includes("Network error")) {
          setError(
            "Errore di connessione. Verifica la tua connessione internet."
          );
        } else if (err.message.includes("timeout")) {
          setError("Timeout dell'upload. Riprova con un file più piccolo.");
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
      abortControllerRef.current = null;
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

      {/* Progress Bar with Cancel Option */}
      {loading && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-blue-700">
              Caricamento in corso...
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-700">
                {progress}%
              </span>
              <button
                type="button"
                onClick={cancelUpload}
                className="text-xs text-red-600 hover:text-red-800 underline"
              >
                Annulla
              </button>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          {progress > 0 && (
            <div className="text-xs text-gray-500 mt-1 text-center">
              {progress < 100 ? "Caricamento file..." : "Elaborazione..."}
            </div>
          )}
        </div>
      )}

      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          {loading ? "Caricamento..." : "Carica Immagine"}
        </button>
        {loading && (
          <button
            type="button"
            onClick={cancelUpload}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Annulla
          </button>
        )}
      </div>
    </form>
  );
}
