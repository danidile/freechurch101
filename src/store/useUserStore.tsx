import { create } from "zustand";
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";
import { GroupedNotificationsT, isLeaderT } from "@/utils/types/types";
import { getNotificationsById } from "@/hooks/GET/getNotificationsById";
import isTeamLeaderClient from "@/utils/supabase/isTeamLeaderClient";

type UserStore = {
  userData: basicUserData | null;
  loading: boolean;
  error: string | null;
  notifications: GroupedNotificationsT;
  isLeader: isLeaderT;
  fetchUser: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => ({
  userData: null,
  loading: false,
  error: null,
  isLeader: {
    isLeader: false,
    teams: [],
  },
  notifications: {},
  fetchUser: async () => {
    set({ loading: true, error: null });

    try {
      const data = await fbasicUserData();
      set({ userData: data });
      if (data.loggedIn) {
        const leaderStatus = await isTeamLeaderClient();
        set({ isLeader: leaderStatus, loading: false });
        const fetchedNotifications = await getNotificationsById(data.id);
        set({ notifications: fetchedNotifications });
      }
    } catch (err: any) {
      console.error("Error in fetchUser:", err);
      set({ error: err.message || "Unknown error", loading: false });
    }
  },
}));
