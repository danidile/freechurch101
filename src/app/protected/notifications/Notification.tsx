"use client";
import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "@/utils/supabase/getUserData";
import Link from "next/link";
import { getSetListsByChurch } from "@/hooks/GET/getSetListsByChurch";
import { notificationT, setListT } from "@/utils/types/types";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { IoEnterOutline } from "react-icons/io5";
import { getNotificationsById } from "@/hooks/GET/getNotificationsById";
import { CgNotifications } from "react-icons/cg";
import { FaCircle } from "react-icons/fa";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
export default function NotificationElement({
  nextDate,
  notification,
}: {
  nextDate: Date;
  notification: notificationT;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  console.log("notification.setlist.date");
  console.log(notification.setlist);
  const date = new Date(notification.setlist.date);
  const readableCurrentDate = date.toLocaleString("it-IT", {
    weekday: "long", // "Sunday"
    year: "numeric", // "2024"
    month: "long", // "November"
    day: "numeric", // "10"
    // hour: "2-digit", // "10"
    // minute: "2-digit", // "22"
    // second: "2-digit", // "46"
  });
  const dateDay = date.toLocaleString("it-IT", {
    day: "numeric", // "10"
  });
  const dateMonth = date.toLocaleString("it-IT", {
    month: "long", // "November"
  });
  const dateWeekDay = date.toLocaleString("it-IT", {
    weekday: "short", // "Sunday"
  });
  let isSunday = false;
  if (dateWeekDay == "dom") {
    isSunday = true;
  }
  if (nextDate <= date) {
    return (
      <>
        <div
          className="setlist-list-link"
          onClick={onOpen}
        >
          <div className="setlist-list" key={notification.id}>
            <div className="setlist-date-avatar">
              <p
                className={`setlist-day ${
                  isSunday ? "text-red-400" : "text-black"
                }`}
              >
                {dateDay}
              </p>
              <small className="setlist-weekday">{dateWeekDay}</small>
            </div>

            <p className="setlist-name" key={notification.id}>
              {notification.setlist.event_title}
              <br />
              <small>{notification.team.team_name}</small>
            </p>
            <FaCircle
              size={15}
              color={`
    ${notification.status == "pending" ? "#ffe55d" : ""}
`}
            />
          </div>
        </div>
        <Modal placement="center" isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1"></ModalHeader>
                <ModalBody>
                  <h5>{notification.setlist.event_title}</h5>
                  <p>{readableCurrentDate}</p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    fullWidth
                    color="danger"
                    variant="light"
                    onPress={onClose}
                  >
                    Rifiuta
                  </Button>
                  <Button fullWidth color="primary" onPress={onClose}>
                    Conferma
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }
}
