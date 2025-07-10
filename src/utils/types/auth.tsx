import z from "zod";

export const authSchema = z.object({
  name: z.string(),
  lastname: z.string(),
  church: z.string(),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 5 characters long"),
  churchName: z.string(),
  website: z.string(),
  address: z.string(),
  igHandle: z.string(),
  pastor: z.string(),
  room_name: z.string(),
  comune: z.string(),
});
export type TauthSchema = z.infer<typeof authSchema>;

export const lostPasswordSchema = z.object({
  email: z.string().email(),
});
export type TlostPasswordSchema = z.infer<typeof lostPasswordSchema>;

export const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 5 characters long"),
  confirmPassword: z
    .string()
    .min(8, "Password must be at least 5 characters long"),
});
export type TresetPasswordSchema = z.infer<typeof resetPasswordSchema>;
