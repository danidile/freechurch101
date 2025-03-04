"use client";

import { basicUserData } from "@/utils/types/userData";
import { create } from "zustand";

interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
}

interface UserStore {
  user: basicUserData | null;
  setUser: (user: basicUserData | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
