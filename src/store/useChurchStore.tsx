import { create } from "zustand";
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";
import { eventType } from "@/utils/types/types";
import getChurchEventTypes from "./getChurchEventTypes";
type useChurchStore = {
  eventTypes: eventType[] | null;
  loadingChurchData: boolean;
  errorChurchData: string | null;
  fetchChurchData: (churchId: string) => Promise<void>;
};

export const useChurchStore = create<useChurchStore>((set) => ({
  eventTypes: null,
  loadingChurchData: false,
  errorChurchData: null,

  fetchChurchData: async (churchId: string) => {
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
  },
}));
