import { create } from "zustand";
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";
import {
  churchMembersT,
  eventType,
  profileT,
  roomsType,
  scheduleTemplate,
  TagWithDescription,
} from "@/utils/types/types";
import getChurchEventTypes from "./getChurchEventTypes";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { getProfilesByChurch } from "@/hooks/GET/getProfilesByChurch";
import getChurchTags from "./getChurchTags";
import { getRoomsByChurch } from "@/hooks/GET/getRoomsByChurch";
import { getScheduleTemplateById } from "@/hooks/GET/getScheduleTemplateById";
import { getChurchScheduleTemplates } from "@/hooks/GET/getChurchScheduleTemplates";
import { getChurchScheduleTemplatesFull } from "@/hooks/GET/getChurchScheduleTemplatesFull";
type useChurchStore = {
  eventTypes: eventType[] | null;
  scheduleTemplates: scheduleTemplate[] | null;

  churchMembers: profileT[] | null;
  loadingChurchData: boolean;
  errorChurchData: string | null;
  rooms: roomsType[];
  tags: TagWithDescription[];
  fetchChurchData: (churchId: string, role?: string) => Promise<void>;
  fetchChurchScheduleTemplates: (churchId: string) => Promise<void>;
};

export const useChurchStore = create<useChurchStore>((set) => ({
  eventTypes: null,
  scheduleTemplates: [],
  churchMembers: null,
  loadingChurchData: false,
  errorChurchData: null,
  tags: [],
  rooms: [],

  fetchChurchData: async (churchId: string, role?: string) => {
    set({ loadingChurchData: true, errorChurchData: null });
    try {
      console.time("fetchChurchData");
      const data = await getChurchEventTypes(churchId);
      set({ eventTypes: data });
      const tags = await getChurchTags(churchId);
      set({ tags: tags });
      const fetchedRooms: roomsType[] = await getRoomsByChurch(churchId);
      set({ rooms: fetchedRooms });

      console.timeEnd("fetchChurchData");
    } catch (err: any) {
      console.error("Error in fetchChurchData:", err);

      set({
        errorChurchData: err.message || "Unknown error",
        loadingChurchData: false,
      });
    }
    if (hasPermission(role as Role, "read:churchmembers")) {
      getProfilesByChurch(churchId).then((fetchedPeople: profileT[]) => {
        set({ churchMembers: fetchedPeople, loadingChurchData: false });
      });
    }
  },
  fetchChurchScheduleTemplates: async (churchId: string) => {
    try {
      console.time("fetchChurchData");

      const fetchedScheduleTemplates: scheduleTemplate[] =
        await getChurchScheduleTemplatesFull(churchId);
      set({
        scheduleTemplates: fetchedScheduleTemplates,
      });
      console.timeEnd("fetchChurchData");
    } catch (err: any) {
      console.error("Error in fetchChurchData:", err);
    }
  },
}));
