// components/AuthProvider.tsx
"use client";

import { useEffect } from "react";
import { useUserStore } from "./store";
import { createClient } from "@/utils/supabase/client";
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const setUser = useUserStore((state) => state.setUser);
  const setLoading = useUserStore((state) => state.setIsLoading);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      const userData: basicUserData = await fbasicUserData();
      setUser(userData);
      setLoading(false);
    };

    getUser();

    // Optional: Listen for changes (e.g., login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUser();
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [setUser, setLoading]);

  return <>{children}</>;
}
