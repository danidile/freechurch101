"use client";

import { resetPasswordAction } from "@/app/actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TresetPasswordSchema, resetPasswordSchema } from "@/utils/types/auth";
import { useState } from "react";

export default function ResetPasswordComponent() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TresetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const [passwordResetted, setPasswordReset] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertData = async (data: TresetPasswordSchema) => {
    setError(null);
    try {
      const result = await resetPasswordAction(data);
      if (result?.success) {
        setPasswordReset(true);
      } else {
        setError(result?.message || "Errore durante il reset della password.");
      }
    } catch {
      setError("Errore durante il reset della password.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(convertData)}
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      {passwordResetted ? (
        <div
          style={{
            backgroundColor: "#d1fae5",
            color: "#065f46",
            padding: "1rem",
            borderRadius: "0.375rem",
            border: "1px solid #10b981",
          }}
          role="alert"
        >
          <strong>Password reimpostata.</strong>
          <p>Da ora potrai accedere con la nuova password.</p>
        </div>
      ) : (
        <>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 500 }}>
            Reset password
          </h1>
          <p style={{ color: "#6b7280" }}>Inserisci la tua nuova password.</p>

          {error && (
            <div
              role="alert"
              style={{
                backgroundColor: "#fee2e2",
                color: "#b91c1c",
                padding: "1rem",
                borderRadius: "0.375rem",
                border: "1px solid #ef4444",
              }}
            >
              <strong>Errore</strong>
              <p>{error}</p>
            </div>
          )}

          <label htmlFor="password">New password</label>
          <input
            {...register("password")}
            type="password"
            id="password"
            name="password"
            placeholder="Nuova password"
            required
            minLength={8}
            className="cinput"
          />

          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            {...register("confirmPassword")}
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Conferma password"
            required
            minLength={8}
            className="cinput"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="csubmit"
          >
            {isSubmitting ? "Caricamento..." : "Reset password"}
          </button>
        </>
      )}
    </form>
  );
}
