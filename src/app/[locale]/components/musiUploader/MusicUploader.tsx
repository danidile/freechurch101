"use client";

import {
  useCallback,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useDropzone } from "react-dropzone";
import { useUserStore } from "@/store/useUserStore";

export type MusicUploaderHandle = {
  upload: (
    songId?: string
  ) => Promise<{ success: boolean; url?: string; error?: string }>;
  reset: () => void;
  hasFile: () => boolean; // 👈 aggiunto
};

const MusicUploaderInput = forwardRef<MusicUploaderHandle>((_, ref) => {
  const { userData } = useUserStore();
  const fileRef = useRef<File | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [fileName, setFileName] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    upload: handleUpload,
    reset: () => {
      setFileName(null);
      fileRef.current = null;
      setProgress(0);
      setError(null);
    },
    hasFile: () => !!fileRef.current, // 👈 aggiungi questo
  }));

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFileName(file.name);
    fileRef.current = file;
    setProgress(0);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "audio/*": [] },
    maxFiles: 1,
  });

  const handleUpload = async (
    songId?: string
  ): Promise<{ success: boolean; url?: string; error?: string }> => {
    if (!userData?.id || !fileRef.current) {
      return { success: false, error: "Dati mancanti o file non selezionato." };
    }

    const file = fileRef.current;

    if (file.size > 10 * 1024 * 1024) {
      return {
        success: false,
        error: "Il file è troppo grande. Limite massimo 10MB.",
      };
    }

    if (!file.type.startsWith("audio/")) {
      return { success: false, error: "Formato non valido. Solo file audio." };
    }

    const formData = new FormData();
    formData.append("userId", userData.id);
    formData.append("file", file);
    formData.append("songId", songId);

    setLoading(true);
    setProgress(0);

    try {
      const result = await new Promise<any>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        abortControllerRef.current = new AbortController();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setProgress(percent);
          }
        };

        xhr.onload = () => {
          try {
            const response = JSON.parse(xhr.responseText);
            response.success ? resolve(response) : reject(response);
          } catch {
            reject({ error: "Risposta non valida dal server" });
          }
        };

        xhr.onerror = () => reject({ error: "Errore di rete" });
        xhr.onabort = () => reject({ error: "Upload annullato" });
        xhr.ontimeout = () => reject({ error: "Timeout upload" });

        xhr.timeout = 60000;
        xhr.open("POST", "/api/upload-music");
        xhr.send(formData);

        abortControllerRef.current.signal.addEventListener("abort", () => {
          xhr.abort();
        });
      });

      return { success: true, ...result };
    } catch (err: any) {
      return { success: false, error: err?.error || "Errore sconosciuto" };
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="w-full">
      {!fileName && (
        <div
          {...getRootProps()}
          className="p-4 border-2 border-dashed rounded-xl text-center cursor-pointer hover:border-blue-400 transition"
        >
          <input {...getInputProps()} />
          <p>
            {isDragActive
              ? "Rilascia file audio qui"
              : "Trascina o clicca per selezionare un file audio (max 10MB)"}
          </p>
        </div>
      )}

      {fileName && (
        <p className="mt-2 text-sm text-gray-700 text-center">
          File selezionato: <strong>{fileName}</strong>
        </p>
      )}

      {loading && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-center text-gray-500 mt-1">
            {progress < 100 ? `${progress}%` : "Elaborazione..."}
          </p>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
      )}
    </div>
  );
});

export default MusicUploaderInput;
