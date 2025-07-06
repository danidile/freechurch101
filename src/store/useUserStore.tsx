import { create } from "zustand";
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";
import { GroupedNotificationsT } from "@/utils/types/types";
import { getNotificationsById } from "@/hooks/GET/getNotificationsById";

type UserStore = {
  userData: basicUserData | null;
  loading: boolean;
  error: string | null;
  notifications: GroupedNotificationsT;
  fetchUser: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => ({
  userData: null,
  loading: false,
  error: null,
  notifications: {},
  fetchUser: async () => {
    set({ loading: true, error: null });

    try {
      const data = await fbasicUserData();
      set({ userData: data, loading: false });
      if (data.loggedIn) {
        const fetchedNotifications = await getNotificationsById(data.id);
        set({ notifications: fetchedNotifications });
      }
    } catch (err: any) {
      console.error("Error in fetchUser:", err);
      set({ error: err.message || "Unknown error", loading: false });
    }
  },
}));
