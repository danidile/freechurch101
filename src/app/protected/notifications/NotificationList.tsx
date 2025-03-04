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

  const removeFromList = (NotificationId: string, onClose: () => void) => {
    setNotificationState((prevState: GroupedNotificationsT) => {
      return Object.keys(prevState).reduce((newState, key) => {
        const typedKey = key as keyof GroupedNotificationsT; // Explicitly type key

        newState[typedKey] = {
          ...prevState[typedKey],
          notifications: prevState[typedKey].notifications.filter(
            (notification: notificationT) => notification.id !== NotificationId
          ),
        };
        return newState;
      }, {} as GroupedNotificationsT);
    });
    onClose;
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
                          type="pending"
                          notification={notification}
                          nextDate={nextDate}
                          removeFromList={removeFromList}
                        />
                      );
                    }
                  )}
              </Tab>
            );
          }
        )}
      </Tabs>
    </>
  );
}
