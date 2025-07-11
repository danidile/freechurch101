import { create } from "zustand";
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";
import {
  churchMembersT,
  eventType,
  profileT,
  roomsType,
  TagWithDescription,
} from "@/utils/types/types";
import getChurchEventTypes from "./getChurchEventTypes";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { getProfilesByChurch } from "@/hooks/GET/getProfilesByChurch";
import getChurchTags from "./getChurchTags";
import { getRoomsByChurch } from "@/hooks/GET/getRoomsByChurch";
type useChurchStore = {
  eventTypes: eventType[] | null;
  churchMembers: profileT[] | null;
  loadingChurchData: boolean;
  errorChurchData: string | null;
  rooms: roomsType[];
  tags: TagWithDescription[];
  fetchChurchData: (churchId: string, role?: string) => Promise<void>;
};

export const useChurchStore = create<useChurchStore>((set) => ({
  eventTypes: null,
  churchMembers: null,
  loadingChurchData: false,
  errorChurchData: null,
  tags: [],
  rooms: [],

  fetchChurchData: async (churchId: string, role?: string) => {
    set({ loadingChurchData: true, errorChurchData: null });
    try {
      const data = await getChurchEventTypes(churchId);
      set({ eventTypes: data });
      const tags = await getChurchTags(churchId);
      set({ tags: tags });
      const fetchedRooms: roomsType[] = await getRoomsByChurch(churchId);
      set({ rooms: fetchedRooms, loadingChurchData: false });
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
}));
