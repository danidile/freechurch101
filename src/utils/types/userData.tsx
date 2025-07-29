import z from "zod";

export const userData = z.object({
  id: z.string(),
  name: z.string(),
  lastname: z.string(),
  church: z.string(),
});
export type TuserData = z.infer<typeof userData>;
export type profilesTeams = { team_id: string; role: string };
export type basicUserData = {
  loggedIn?: boolean;
  id?: string;
  email?: string;
  name?: string;
  phone?: string;
  role?: string;
  lastname?: string;
  church_id?: string;
  church_name?: string;
  pending_church_confirmation?: boolean;
  fetched?: boolean;
  church_logo?: string;
  teams?: profilesTeams[];
  avatar_url?: string;
};

export type calendarMonth = {
  name?: string;
  year?: number;
  month?: number;
  days?: number[];
  emptySpaces?: number;
};

export const basicUserDataSchema = z.object({
  loggedIn: z.boolean().optional(),
  id: z.string().optional(),
  email: z.string().email().optional(),
  name: z.string().min(1, "Il nome è obbligatorio").optional(),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9+\-\s]*$/.test(val), {
      message: "Numero di telefono non valido",
    }),
  role: z.string().optional(),
  lastname: z.string().min(1, "Il cognome è obbligatorio").optional(),
  church_id: z.string().optional(),
  church_name: z.string().optional(),
  pending_church_confirmation: z.boolean().optional(),
  fetched: z.boolean().optional(),
  church_logo: z.string().optional(),
  teams: z.array(z.string()).optional(),
  leaderOf: z.array(z.string()).optional(),
  avatar_url: z.string().optional(),
});
