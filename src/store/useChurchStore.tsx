import { create } from "zustand";
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";
import { churchMembersT, eventType, profileT } from "@/utils/types/types";
import getChurchEventTypes from "./getChurchEventTypes";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { getProfilesByChurch } from "@/hooks/GET/getProfilesByChurch";
type useChurchStore = {
  eventTypes: eventType[] | null;
  churchMembers: profileT[] | null;
  loadingChurchData: boolean;
  errorChurchData: string | null;
  fetchChurchData: (churchId: string, role?: string) => Promise<void>;
};

export const useChurchStore = create<useChurchStore>((set) => ({
  eventTypes: null,
  churchMembers: null,
  loadingChurchData: false,
  errorChurchData: null,

  fetchChurchData: async (churchId: string, role?: string) => {
    set({ loadingChurchData: true, errorChurchData: null });
    try {
      const data = await getChurchEventTypes(churchId);
      set({ eventTypes: data, loadingChurchData: false });
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
