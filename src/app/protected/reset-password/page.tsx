"use client";

import { resetPasswordAction } from "@/app/actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { resetPasswordSchema, TresetPasswordSchema } from "@/utils/types/auth";
import { AnimatePresence, motion } from "framer-motion";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

export default function ResetPasswordComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TresetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordResetted, setPasswordReset] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const convertData = async (data: TresetPasswordSchema) => {
    const response = await resetPasswordAction(data);
    if (!response.success) {
      setErrorMessage(response.message);
    } else {
      setPasswordReset(true);
      setErrorMessage(null);
    }
  };

  return (
    <div className="container-sub">
      <form
        onSubmit={handleSubmit(convertData)}
        className="flex flex-col w-full max-w-md p-4 gap-2"
      >
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="mt-4 rounded-lg bg-red-50 p-4 border border-red-600 text-red-800 text-sm"
            >
              ❌ {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {passwordResetted ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <strong>Password reimpostata.</strong>
            <p className="text-sm">
              Da ora potrai accedere con la nuova password.
            </p>
          </div>
        ) : (
          <>
            <h4 className="text-lg font-semibold">Reset password</h4>
            <p className="text-sm text-gray-600">
              Inserisci la tua nuova password.
            </p>

            {/* Password field */}
            <div>
              <label htmlFor="password">Nuova password</label>{" "}
              <div className="relative">
                <input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  {...register("password")}
                  className="cinput"
                  placeholder="Nuova password"
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  aria-label="toggle password visibility"
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>{" "}
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword">Conferma password</label>

              <div className="relative">
                <input
                  required
                  type={confirmPasswordVisible ? "text" : "password"}
                  id="confirmpassword"
                  name="ConfirmPassword"
                  {...register("confirmPassword")}
                  placeholder="Password..."
                  minLength={8}
                  className="cinput"
                />
                <button
                  type="button"
                  onClick={() => setConfirmPasswordVisible((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  aria-label="toggle Confirm password visibility"
                >
                  {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              Reset password
            </button>
          </>
        )}
      </form>
    </div>
  );
}
