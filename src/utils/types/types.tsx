import { CalendarDate, DateValue } from "@internationalized/date";
import z from "zod";

export type songSchema = {
  id: string;
  song_title: string;
  tags?: string;
  author?: string;
  artist?: string;
  upload_key: string;
  lyrics: string;
  album: string;
  bpm?: string;
  tempo?: string;
  type?: string;
};

export type songType = {
  id?: string;
  created_at?: string;
  song_title?: string;
  lyrics?: string;
  author?: string;
  upload_key?: string;
  album?: string;
  artist?: string;
  setlist_id?: string;
  song?: string;
  key?: string;
  order?: number;
  church?: string;
  tags?: string;
  bpm?: string;
};

export type roomsType = {
  name: string;
  address: string;
  comune: string;
  church: string;
  id: string;
};
export type TagWithDescription = {
  id?: string;
  tag?: string;
  name?: string;
  description?: string;
};

export type Comune = {
  nome: string;
  codice: string;
  sigla: string;
  provincia: string;
  regione: string;
};

export type songsListType = songType[];

export type eventSchema = {
  event_type: string;
  event_title: string;
  date: string;
  hour: string;
};

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

export type church = {
  id: string;
  churchName?: string;
  pastor?: string;
  address?: string;
  website?: string;
  igHandle?: string;
  city?: string;
  provincia?: string;
};
export type Tchurch = church;

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

// Section schema with validations
const eventSectionSchema = z.object({
  id: z.string().optional(),
  song_title: z
    .string()
    .min(1, "Il titolo della canzone è obbligatorio")
    .optional(),
  sectionType: z.string().min(1, "Il tipo di sezione è obbligatorio"),
  duration: z.string().optional(),
  description: z.string().optional(),
  songId: z.string().optional(),
  song: z.string().optional(),
  key: z.string().optional(),
});

// Main form schema with validations
export const eventFormSchema = z.object({
  event_type: z.string().min(1, "Devi selezionare un tipo di evento"),
  church: z.string().min(1, "Devi indicare la chiesa"),
  date: z.string().optional(),
  room_id: z.string(),
  eventDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato data non valido (YYYY-MM-DD)")
    .min(1, "La data dell'evento è obbligatoria"),
  private: z.boolean().optional(),
  hour: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Inserisci un orario valido (HH:mm)")
    .min(1, "L'orario è obbligatorio"),
  sections: z.array(eventSectionSchema).optional(),
});

// Optional: infer the TypeScript type automatically
export type formValues = z.infer<typeof eventFormSchema>;

export type eventType = {
  id?: string;
  key?: string;
  label?: string;
  alt?: string; //Alternative label (the personalized label)
  placeholder?: string;
  edited?: string;
  color?: string;
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
  id?: number;
  name?: string;
  lastname?: string;
  roles?: string;
  email: string;
  hasbeenmodified?: boolean;
};
export type newMember = {
  id?: number;
  name?: string;
  lastname?: string;
  roles?: string;
  email?: string;
  church?: string;
  token?: string;
  status?: string;
  created_at?: string;
  email_status?: string;
  last_email?: string;
  error?: string;
  church_logo?: string;
  church_name?: string;
};
export type BlockedDate = {
  id: string;
  start: Date;
  end: Date;
};
export type Team = {
  id: string;
  team_name: string;
  teamMembers?: TeamMember[];
  leaders?: string[];
  member_count?: number;
  is_worship?: boolean;
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
  church?: string;
  profile?: string;
};

export type isLeaderT = { isLeader: boolean; teams: string[] };

export type profileTeamsT = {
  team_name?: string;
  roles?: string[];
};

export type TeamMemberRaw = {
  team_id: {
    team_name: string;
  };
  roles: string;
};

export type setListSongT = {
  id?: string;
  song?: string;
  singer?: string;
  singerName?: string;
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
  note?: string;
  setlist_id?: string;
  title?: string;
  originalIndex?: number;
};

export type setListT = {
  id?: string;
  event_title?: string;
  event_type?: string;
  date?: string;
  hour?: string;
  setListSongs?: setListSongT[];
  type?: string;
  private?: boolean;
  teamMembers?: {
    id?: string;
    profile?: string;
  };
  teams?: teamData[];
  setlistTeams?: GroupedMembers;
  color?: string;
  room?: string;
  schedule?: setListSongT[];
};

export type scheduleTemplate = {
  id?: string;
  name: string;
  event_title?: string;
  event_type?: string;
  hour?: string;

  room?: string;
  schedule?: setListSongT[];
};
export const scheduleTemplateSchema = z.object({
  name: z.string().min(4, "Il nome deve contenere almeno 4 caratteri"),
});
export type teamData = {
  id?: string;
  team_name?: string;
  team_leaders?: churchMembersT[];
  team_members?: churchMembersT[];
  is_worship?: boolean;
  selected?: churchMembersT[];
};
export type Blockout = {
  start: string; // ISO date string like "2025-08-07"
  end: string; // ISO date string like "2025-08-09"
};
export type churchMembersT = {
  id?: string;
  status?: string;
  email?: string;
  name?: string;
  lastname?: string;
  skills?: string[];
  team_id?: string;
  roles?: string[];
  role?: string;
  selected_roles?: string;
  profile?: string;
  team_name?: string;
  blockouts?: Blockout[];
  isLeader?: boolean;
  lead?: boolean;
};
export type TeamMemberWithBlockouts = {
  id: string;
  name: string;
  lastname: string;
  blockouts: Blockout[];
};

export type TeamWithBlockouts = {
  team_name: string;
  team_id: string;
  teamMembers: TeamMemberWithBlockouts[];
};
export type searchBar = {
  text: string;
};

export type ChurchMemberByTeam = {
  id: number;
  lead?: boolean; // Ensure lead is a boolean
  team_name: string;
  profile: string;
  name: string;
  lastname: string;
  status?: string;
  role?: string;
  selected_roles?: string;
  roles?: string;
  phone?: string;
  last_email?: Date;
};

export type GroupedMembers = Record<string, ChurchMemberByTeam[]>;

export type artistsT = {
  username: string;
  artist_name: string;
};
export type albumsT = {
  id?: string;
  album_name?: string;
  release_date?: Date;
  artist_username?: string;
};

export type notificationDetails = {
  title?: string;
  color?: string;
};

export type notificationT = {
  id?: string;
  setlist?: setListT;
  team?: teamData;
  status?: string;
};

export type NotificationsT = {
  notifications?: notificationT[];
  details?: notificationDetails;
};

export type GroupedNotificationsT = {
  pending?: NotificationsT;
  confirmed?: NotificationsT;
  denied?: NotificationsT;
  info?: NotificationsT;
};

export type expandedTeamT = {
  id?: string;
  setlist?: string;
  member?: string;
  team?: string;
  roles?: string;
  pending?: string;
  lead?: boolean; // Ensure lead is a boolean
  status?: string;
};

export type pendingRequestsT = {
  id?: string;
  created_at?: string;
  name?: string;
  lastname?: string;
  email?: string;

  profile?: {
    id?: string;
    name?: string;
    email?: string;
    lastname?: string;
  };
};

export type profileSetlistsT = {
  id: string;
  setlist_id: string;
  team_name: string;
  event_title: string;
  event_type: string;
  date: string;
  status: string;
};

// Album table type (only selecting album_name)
export type AlbumReference = {
  album_name: string | null;
};

// Song from 'global-songs' with a joined album
export type SongWithAlbum = {
  id?: string;
  song_title?: string;
  lyrics?: string;
  author?: string;
  upload_key?: string;
  artist?: string;
  album?: AlbumReference | null; // joined album
  tags?: string;
  bpm?: string;
};

// Grouped object by album name
export type GroupedSongsByAlbum = Record<string, SongWithAlbum[]>;

export type RangeValue = {
  profile?: string;
  id?: string;
  start: DateValue;
  end: DateValue;
};
export type RangeValueString = {
  profile?: string;
  id?: string;
  start: string;
  end: string;
};
export type LeaderT = {
  id?: string;
  profile?: string;
  team?: string;
  created_at?: string;
};

export type registrationData = {
  firstName: string;
  lastName: string;
  church: string;
  email: string;
  password: string;
  isCreatingChurch?: boolean;
  churchName?: string;
  pastor?: string;
  address?: string;
  website?: string;
  igHandle?: string;
  provincia?: string;
  city?: string;
  token?: string;
  room_name?: string;
  comune?: string;
};

export type loginData = {
  email?: string;
  password?: string;
};

export type ServerActionResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};
export type ChipColor =
  | "warning"
  | "success"
  | "danger"
  | "default"
  | "primary"
  | "secondary";

export type Permission = {
  team_id: string;
  role: string;
  resource: string;
  action: string;
  allowed: boolean;
};
