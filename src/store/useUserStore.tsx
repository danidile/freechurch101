import { create } from "zustand";
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";

type UserStore = {
  userData: basicUserData | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => ({
  userData: {
    loggedIn: false,
    role: "user", // No array, safe access
  },
  loading: false,
  fetchUser: async () => {
    set({ loading: true });
    const data: basicUserData = await fbasicUserData();
    set({ userData: data });
    set({ loading: false });
  },
}));
