import { songType } from "@/utils/types/types";
import { basicUserData } from "@/utils/types/userData";
import { create } from "zustand";

type SongsStore = {
  songList: songType[];
  isLoading: boolean;
  setSongList: (songs: songType[]) => void;
  setIsLoading: (loading: boolean) => void;
};

export const useSongsStore = create<SongsStore>((set) => ({
  songList: [],
  isLoading: true,
  setSongList: (songs) => set({ songList: songs }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));

type UserStore = {
  user: basicUserData;
  setUser: (user: basicUserData) => void;

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: {
    loggedIn: false,
    role: "user",
  },
  setUser: (userData) => set({ user: userData }),

  isLoading: true,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
