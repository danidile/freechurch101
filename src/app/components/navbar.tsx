"use client";

import MenuBarComponentSecondary from "./menuBarComponent2";
import { useEffect, useState } from "react";
import { getPendingNotificationsById } from "@/hooks/GET/getPendingNotificationsById";
import { useUserStore } from "@/store/useUserStore";

export default function MenuBar() {
  const [notifications, setNotifications] = useState<number>(0);
  const { userData } = useUserStore();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (userData.fetched && userData.loggedIn) {
        const count = await getPendingNotificationsById();
        setNotifications(count);
      }
    };
    fetchNotifications();
  }, []);
  return <MenuBarComponentSecondary notifications={notifications} />;
}
