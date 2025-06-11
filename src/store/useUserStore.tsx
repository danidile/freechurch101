import { create } from "zustand";
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";

type UserStore = {
  userData: basicUserData | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => ({
  userData: null,
  loading: false,
  error: null,
  fetchUser: async () => {
    set({ loading: true, error: null });

    try {
      const data = await fbasicUserData();
      set({ userData: data, loading: false });
    } catch (err: any) {
      console.error("Error in fetchUser:", err);
      set({ error: err.message || "Unknown error", loading: false });
    }
  },
}));
