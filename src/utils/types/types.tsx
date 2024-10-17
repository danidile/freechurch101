import z from "zod";


export const songSchema = z.object({
    id: z.string().optional(),
    songtitle: z.string().min(5,"Song Title must be at least 5 characters long"),
    author: z.string(),
    key: z.string(),
    lyrics: z.string()
    

  })
  export type TsongSchema = z.infer<typeof songSchema>;



  export const eventSchema = z.object({
    eventTitle: z.string(),
    date: z.date(),
    start: z.string(),
    location: z.string(),
    

  })
  export type TeventSchema = z.infer<typeof eventSchema>;


  export const alertMessage = z.object({
    success: z.string(),
    error: z.string(),
    message: z.string()
    

  })
  export type TalertMessage = z.infer<typeof alertMessage>;




  export const church = z.object({
    churchName: z.string(),
    pastor: z.string(),
    address: z.string(),
    website: z.string(),
    igHandle: z.string()
  })
  export type Tchurch = z.infer<typeof church>;

  export const churchMinimalData = z.object({
    posts: z.array(
    z.object({
      id: z.string(),
      churchName: z.string()
    }),
  )
  })
  export type TchurchMinimalData = z.infer<typeof churchMinimalData>["posts"][number];