"use client";

import MenuBarComponentSecondary from "./menuBarComponent2";
import { useEffect, useState } from "react";
import { getPendingNotificationsById } from "@/hooks/GET/getPendingNotificationsById";

export default function MenuBar() {
  const [notifications, setNotifications] = useState<number>(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      const count = await getPendingNotificationsById();
      setNotifications(count);
    };
    fetchNotifications();
  }, []);

  return <MenuBarComponentSecondary notifications={notifications} />;
}
