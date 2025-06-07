"use client";

import {
  GroupedNotificationsT,
  NotificationsT,
  notificationT,
} from "@/utils/types/types";
import { useEffect, useState } from "react";
import NotificationElement from "./Notification";
import { Tabs, Tab, Spinner } from "@heroui/react";
import { AnimatePresence } from "framer-motion";
import { getSongs } from "@/hooks/GET/getSongs";
import { useUserStore } from "@/store/useUserStore";
import LoadingSongsPage from "../songs/loading";
import { getNotificationsById } from "@/hooks/GET/getNotificationsById";

export default function NotificationList() {
  const { userData, fetchUser, loading } = useUserStore();
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [notificationState, setNotificationState] =
    useState<GroupedNotificationsT>();

  useEffect(() => {
    const fetchEverything = async () => {
      if (!userData.loggedIn && !loading) {
        await fetchUser();
      }

      // Now wait until user is definitely available
      if (userData.loggedIn && !loading) {
        const fetchedNotifications = await getNotificationsById(userData.id);
        setNotificationState(fetchedNotifications);
        setLoadingNotifications(false);
      }
    };

    fetchEverything();
  }, [userData.loggedIn, loading]);

  if (loading || loadingNotifications || !userData.loggedIn)
    return (
      <div className="container-sub">
        <Spinner size="lg" />
      </div>
    );

  const currentDate = new Date();
  const nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() - 1);

  const moveFromList = (
    NotificationId: string,
    onClose: () => void,
    destinationType: string
  ) => {
    setNotificationState((prevState: GroupedNotificationsT) => {
      let movedNotification: notificationT | undefined;

      // Create a new state object while extracting the notification to be moved
      const newState = Object.keys(prevState).reduce((acc, key) => {
        const typedKey = key as keyof GroupedNotificationsT;

        const filteredNotifications = prevState[typedKey].notifications.filter(
          (notification) => {
            if (notification.id === NotificationId) {
              movedNotification = notification; // Capture the notification to move
              return false;
            }
            return true;
          }
        );

        acc[typedKey] = {
          ...prevState[typedKey],
          notifications: filteredNotifications,
        };
        return acc;
      }, {} as GroupedNotificationsT);

      // If the notification was found, add it to the destination group
      if (movedNotification) {
        const typedDestinationKey =
          destinationType as keyof GroupedNotificationsT;
        newState[typedDestinationKey] = {
          ...prevState[typedDestinationKey],
          notifications: [
            ...prevState[typedDestinationKey].notifications,
            movedNotification,
          ],
        };
      }

      return newState;
    });

    onClose();
  };

  return (
    <div className=" max-w-[500px] w-full">
      <Tabs
        key="underlined"
        aria-label="Tabs variants"
        variant="underlined"
        fullWidth
      >
        {Object.entries(notificationState).map(
          ([status, notificationsByType]) => {
            if (!notificationsByType.notifications) return null;
            if (notificationsByType.notifications.length > 0) {
              return (
                <Tab
                  className="w-full"
                  key={notificationsByType.details.title}
                  title={notificationsByType.details.title}
                >
                  <AnimatePresence>
                    {notificationsByType.notifications &&
                      notificationsByType.notifications.map(
                        (notification: notificationT) => {
                          return (
                            <NotificationElement
                              details={notificationsByType.details}
                              type={status}
                              notification={notification}
                              nextDate={nextDate}
                              moveFromList={moveFromList}
                            />
                          );
                        }
                      )}
                  </AnimatePresence>
                </Tab>
              );
            }
          }
        )}
      </Tabs>
    </div>
  );
}
