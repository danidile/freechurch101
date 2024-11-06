import z from "zod";


export const songSchema = z.object({
    id: z.string().optional(),
    song_title: z.string().min(5,"Song Title must be at least 5 characters long"),
    author: z.string(),
    upload_key: z.string(),
    lyrics: z.string()
    

  })
  export type TsongSchema = z.infer<typeof songSchema>;



