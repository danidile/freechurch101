import z from "zod";

export const authSchema = z.object({
  name: z.string().min(2, "Il nome deve avere almeno 2 caratteri"),
  lastname: z.string().min(2, "Il cognome deve avere almeno 2 caratteri"),
  email: z.string().email("Email non valida"),
  password: z.string().min(8, "La password deve avere almeno 8 caratteri"),
  churchname: z.string().min(2, "Nome chiesa obbligatorio"),
  phone: z.string().min(6, "Numero di telefono non valido"),
  birthday: z
    .string()
    .min(1, "La data di nascita è obbligatoria")
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, "Data non valida")
    .refine((val) => {
      const date = new Date(val);
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      const monthDiff = today.getMonth() - date.getMonth();
      const dayDiff = today.getDate() - date.getDate();
      const actualAge =
        monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
      return actualAge >= 13;
    }, "Devi avere almeno 13 anni per registrarti"),
  
  pastor: z.string().min(2, "Nome pastore obbligatorio"),
  website: z.string().optional(),
  ighandle: z.string().optional().or(z.literal("")),
  provincia: z.string().min(1, "Provincia richiesta"),
  comune: z.string().min(1, "Comune richiesto"),
  address: z.string().min(2, "Indirizzo obbligatorio"),
});
export type TauthSchema = z.infer<typeof authSchema>;

export const loginSchema = z.object({
  email: z.string().email("Email non valida"),
  password: z.string().min(8, "La password deve avere almeno 8 caratteri"),
});
export type TloginSchema = z.infer<typeof authSchema>;

export const lostPasswordSchema = z.object({
  email: z.string().email(),
});
export type TlostPasswordSchema = z.infer<typeof lostPasswordSchema>;
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "La password deve contenere almeno 8 caratteri"),
    confirmPassword: z
      .string()
      .min(8, "La conferma deve contenere almeno 8 caratteri"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Le password non corrispondono",
  });

export type TresetPasswordSchema = z.infer<typeof resetPasswordSchema>;
