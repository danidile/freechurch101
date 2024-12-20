import z from "zod";

export const songSchema = z.object({
  id: z.string().optional(),
  song_title: z
    .string()
    .min(4, "Song Title must be at least 5 characters long"),
  author: z.string(),
  upload_key: z.string(),
  lyrics: z.string(),
});
export type TsongSchema = z.infer<typeof songSchema>;




export type songType = {
  id: string;
  created_at?: string;
  song_title?: string;
  lyrics?: string;
  author?: string;
  upload_key?: string;
};

export type songsListType = songType[];






export const eventSchema = z.object({
  eventType: z.string().optional().default("1"),
  eventTitle: z.string().optional().default(""),
  date: z.string().date().optional().default("2025-01-01"),
  start: z.string().optional().default("todo"),
  sections: z
    .object({
      sectionId: z.string().optional().default(""),
      sectionType: z.string().optional().default(""),
      duration: z.string().optional().default(""),
      description: z.string().optional().default(""),
      song: z.string().optional().default(""),
    })
    .array()
    .optional(),
});
export type TeventSchema = z.infer<typeof eventSchema>;

export const setlistData = z.object({
  id: z.string().optional(),
  date: z.string().optional(),
  churchName: z.string().optional(),
});
export type TsetlistData = z.infer<typeof setlistData>;

export const alertMessage = z.object({
  success: z.string(),
  error: z.string(),
  message: z.string(),
});
export type TalertMessage = z.infer<typeof alertMessage>;

export const church = z.object({
  churchName: z.string(),
  pastor: z.string(),
  address: z.string(),
  website: z.string(),
  igHandle: z.string(),
});
export type Tchurch = z.infer<typeof church>;

export const churchMinimalData = z.object({
  posts: z.array(
    z.object({
      id: z.string(),
      churchName: z.string(),
    })
  ),
});
export type TchurchMinimalData = z.infer<
  typeof churchMinimalData
>["posts"][number];




export interface Tsections {
  id: number;
  key: string;
  isSong: boolean;
  isTitle: boolean;
  titleText?: string;
  description?: string;
  duration?: string;
  songId?: string;
  tonalita: string;
}
export interface TeventBasics {
  type: string;
  title: string;
  date: string;
}

export interface Tsong {
  id: string;
  song_title: string;
  author: string;
}
export interface TsongNameAuthor {
  id: string;
  author: string;
  song_title: string;
}

export type formValues = {
  eventType: string;
  church: string;
  eventTitle: string;
  date: string;
  sections: {
    sectionType: string;
    duration: string;
    description: string;
    song: string;
    tonalita: string;
  }[];
};