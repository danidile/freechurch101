import z from "zod";

export const userData = z.object({
  id: z.string(),
  name: z.string(),
  lastname: z.string(),
  church: z.string(),
});
export type TuserData = z.infer<typeof userData>;

export type basicUserData = {
  loggedIn?: boolean;
  id?: string;
  email?: string;
  name?: string;
  role?: string;
  lastname?: string;
  church_id?: string;
  church_name?: string;
  pending_church_confirmation?: boolean;
};

export type calendarMonth = {
  name?: string;
  year?: number;
  month?: number;
  days?: number[];
  emptySpaces?: number;
};
