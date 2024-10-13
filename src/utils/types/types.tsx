import z from "zod";


export const songSchema = z.object({
    id: z.string(),
    songtitle: z.string().min(5,"Song Title must be at least 5 characters long"),
    author: z.string(),
    key: z.string(),
    lyrics: z.string()
    

  })
  export type TsongSchema = z.infer<typeof songSchema>;



  export const eventSchema = z.object({
    id: z.string(),
    songtitle: z.string().min(5,"Song Title must be at least 5 characters long"),
    author: z.string(),
    key: z.string(),
    lyrics: z.string()
    

  })
  export type TeventSchema = z.infer<typeof eventSchema>;


  export const alertMessage = z.object({
    success: z.string(),
    error: z.string(),
    message: z.string()
    

  })
  export type TalertMessage = z.infer<typeof alertMessage>;