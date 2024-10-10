import z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';


export const signUpSchema = z.object({
    songtitle: z.string().min(5,"Song Title must be at least 5 characters long"),
    author: z.string(),
    key: z.string(),

  })
  export type TsignUpSchema = z.infer<typeof signUpSchema>;