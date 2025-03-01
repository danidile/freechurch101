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
  album?: string;
  artist?: string;
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
  isSong?: boolean;
  isTitle?: boolean;
  titleText?: string;
  description?: string;
  duration?: string;
  songId?: string;
  tonalita?: string;
}
export interface TeventBasics {
  type: string;
  title: string;
  date: string;
  event_title?: string;
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
  type?: string;
}

export type formValues = {
  eventType?: string;
  church?: string;
  event_title?: string;
  date?: string;
  sections?: {
    id?: string;
    song_title?: string;
    sectionType: string;
    duration?: string;
    description?: string;
    songId?: string;
    song?: string;
    key?: string;
  }[];
};

export type teamFormValues = {
  team_name: string;
  church?: string;
  is_worship?: boolean;
  event_title?: string;
  date?: string;
  sections?: {
    id?: string;
    song_title?: string;
    sectionType: string;
    duration?: string;
    description?: string;
    songId?: string;
    song?: string;
    key?: string;
  }[];
};
export type TeamMember = {
  id: number;
  name: string;
  roles?: string;
  email: string;
  hasbeenmodified?: boolean;
};

export type Team = {
  id: string;
  team_name: string;
  teamMembers?: TeamMember[];
};

export type eventPlanner = {
  eventName: string;
  date: string;
  teams: Team[];
};

export type artistT = {
  username: string;
  date: string;
  artist_name: string;
};

export type albumT = {
  id: string;
  release_date: string;
  album_name: string;
  artist_id: string;
};

export type profileT = {
  map?: any;
  id?: string;
  username?: string;
  email?: string;
  name?: string;
  lastname?: string;
  role?: number;
};

export type setListSongT = {
  id?: string;
  song?: string;
  song_title?: string;
  author?: string;
  key?: string;
  lyrics?: string;
  upload_key?: string;
  order?: number;
  type?: string;
  global_song?: string;
  isSong?: boolean;
  isTitle?: boolean;
  duration?: string;
  tonalita?: string;
};

export type setListT = {
  id?: string;
  event_title?: string;
  date?: string;
  setListSongs?: setListSongT[];
  type?: string;
  teamMembers?: {
    id?: string;
    profile?: string;
  };
};

export type searchBar = {
  text: string;
};

export type churchMembersT = {
  id?: string;
  email?: string;
  name?: string;
  lastname?: string;
  skills?: string[];
  team_id?: string;
  roles?: string[];
  profile?: string;
  team_name?: string;
};

export type teamData = {
  id?: string;
  team_name?: string;
  team_leaders?: churchMembersT[];
  team_members?: churchMembersT[];
  is_worship?: boolean;
  selected?:churchMembersT[];
};



export type ChurchMemberByTeam = {
  id: number;
  team_name: string;
  profile: string;
  name: string;
  lastname: string;
};

export type GroupedMembers = Record<string, ChurchMemberByTeam[]>;
