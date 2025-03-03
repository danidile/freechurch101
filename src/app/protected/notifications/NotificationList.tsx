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

  const removeFromList = (NotificationId: string) => {
    // setNotificationState(
    //   notificationState.filter(
    //     (section: NotificationsT) => section.id !== NotificationId
    //   )
    // );
  };
  return (
    <>
      <Tabs
        key="underlined"
        aria-label="Tabs variants"
        variant="underlined"
        fullWidth
      >
        {Object.entries(notifications).map(([status, notifications]) => {
          return (
            <Tab
              className="w-full"
              key={notifications.details.title}
              title={notifications.details.title}
            >
              {notifications.notifications &&
                notifications.notifications.map(
                  (notification: notificationT) => {
                    return (
                      <NotificationElement
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
        })}
      </Tabs>
    </>
  );
}
