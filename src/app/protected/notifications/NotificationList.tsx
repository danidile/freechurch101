"use client";

import {
  GroupedNotificationsT,
  NotificationsT,
  notificationT,
} from "@/utils/types/types";
import { useState } from "react";
import NotificationElement from "./Notification";
import { Tabs, Tab } from "@heroui/react";

export default function NotificationList({
  notifications,
}: {
  notifications: GroupedNotificationsT;
}) {
  const currentDate = new Date();
  const nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() - 1);

  const [notificationState, setNotificationState] =
    useState<GroupedNotificationsT>(notifications);

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

  console.log("notificationState");
  console.log(notificationState);
  return (
    <>
      <Tabs
        key="underlined"
        aria-label="Tabs variants"
        variant="underlined"
        fullWidth
      >
        {Object.entries(notificationState).map(
          ([status, notificationsByType]) => {
            if (notificationsByType.notifications.length > 0) {
              return (
                <Tab
                  className="w-full"
                  key={notificationsByType.details.title}
                  title={notificationsByType.details.title}
                >
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
                </Tab>
              );
            }
          }
        )}
      </Tabs>
    </>
  );
}
