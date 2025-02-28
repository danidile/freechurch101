import z from "zod";

export const authSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6,"Password must be at least 5 characters long")
  })
  export type TauthSchema = z.infer<typeof authSchema>;


  export const lostPasswordSchema = z.object({
    email: z.string().email(),
  })
  export type TlostPasswordSchema = z.infer<typeof lostPasswordSchema>;


  export const resetPasswordSchema = z.object({
    password: z.string().min(8,"Password must be at least 5 characters long"),
    confirmPassword: z.string().min(8,"Password must be at least 5 characters long")
  })
  export type TresetPasswordSchema = z.infer<typeof resetPasswordSchema>;