"use client";
import { notificationDetails, notificationT } from "@/utils/types/types";
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
import { motion, AnimatePresence } from "framer-motion";
import { confirmAction } from "./confirmAction";
import { denyAction } from "./denyAction";
export default function NotificationElement({
  details,
  type,
  nextDate,
  notification,
  moveFromList,
}: {
  details: notificationDetails;
  type: string;
  nextDate: Date;
  notification: notificationT;
  moveFromList: (
    NotificationId: string,
    onClose: () => void,
    destinationType: string
  ) => void;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
        <AnimatePresence>
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 25,
            }}
            layout
            transition={{ duration: 0.5 }}
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
              <FaCircle size={15} color={details.color} />
            </div>
          </motion.div>
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
                    {type === "confirmed" && (
                      <Button
                        fullWidth
                        color="danger"
                        variant="light"
                        onPress={() => {
                          denyAction(notification.id);
                          moveFromList(notification.id, onClose, "denied");
                        }}
                      >
                        Rifiuta
                      </Button>
                    )}
                    {type === "denied" && (
                      <Button
                        fullWidth
                        color="primary"
                        onPress={() => {
                          confirmAction(notification.id);
                          moveFromList(notification.id, onClose, "confirmed");
                          onClose;
                        }}
                      >
                        Conferma
                      </Button>
                    )}
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </AnimatePresence>
      </>
    );
  }
}
