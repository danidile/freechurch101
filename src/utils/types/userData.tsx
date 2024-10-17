import z from "zod";

export const userData = z.object({
    id: z.string(),
    name: z.string(),
    lastname: z.string(),
    church: z.string()


  })
  export type TuserData = z.infer<typeof userData>;