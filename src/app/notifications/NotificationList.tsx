"use client";

import { GroupedNotificationsT, notificationT } from "@/utils/types/types";
import { useEffect, useState } from "react";
import NotificationElement from "./Notification";
import { Spinner } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { getNotificationsById } from "@/hooks/GET/getNotificationsById";
import { useUserStore } from "@/store/useUserStore";

export default function NotificationList() {
  const { userData, fetchUser, loading } = useUserStore();
  const [notifications, setNotifications] = useState<GroupedNotificationsT>();
  const [isLoading, setIsLoading] = useState(true);
  const [expandedNotificationId, setExpandedNotificationId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userData.loggedIn && !loading) {
        await fetchUser();
      }

      if (userData.loggedIn && !loading) {
        const fetched = await getNotificationsById(userData.id);
        setNotifications(fetched);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userData.loggedIn, loading, fetchUser]);

  const moveNotification = (
    id: string,
    onClose: () => void,
    destination: keyof GroupedNotificationsT
  ) => {
    setNotifications((prev) => {
      if (!prev) return prev;

      let moved: notificationT | undefined;

      const updated = Object.entries(prev).reduce((acc, [key, value]) => {
        const filtered = value.notifications.filter((n) => {
          if (n.id === id) {
            moved = n;
            return false;
          }
          return true;
        });

        acc[key as keyof GroupedNotificationsT] = {
          ...value,
          notifications: filtered,
        };
        return acc;
      }, {} as GroupedNotificationsT);

      if (moved) {
        updated[destination] = {
          ...updated[destination],
          notifications: [...updated[destination].notifications, moved],
        };
      }

      return updated;
    });

    onClose();
  };

  if (isLoading || loading || !userData.loggedIn) {
    return (
      <div className="flex items-center justify-center w-full h-40">
        <Spinner size="lg" />
      </div>
    );
  }

  if (
    !notifications ||
    Object.values(notifications).every(
      (group) => group.notifications.length === 0
    )
  ) {
    return (
      <div className="text-center text-gray-500 py-10">
        Nessuna notifica al momento.
      </div>
    );
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    <div className="w-full max-w-md space-y-10 px-4 py-2">
      {Object.entries(notifications).map(([key, group]) => {
        if (group.notifications.length === 0) return null;

        return (
          <div key={key}>
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur py-2 mb-2">
              <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                {group.details.title}
              </h2>
            </div>
            <div className="space-y-4">
              <AnimatePresence>
                {group.notifications.map((n) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}

                    className="border-b-1"
                  >
                    <NotificationElement
                      type={key as keyof GroupedNotificationsT}
                      notification={n}
                      details={group.details}
                      nextDate={yesterday}
                      moveFromList={moveNotification}
                      isExpanded={expandedNotificationId === n.id} // <-- new prop
                      setExpanded={(id: string) =>
                        setExpandedNotificationId((currentId) =>
                          currentId === id ? null : id
                        )
                      } // <-- new prop
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}
