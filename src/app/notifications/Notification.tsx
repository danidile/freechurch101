"use client";

import {
  GroupedNotificationsT,
  notificationDetails,
  notificationT,
} from "@/utils/types/types";
import { FaCircle } from "react-icons/fa";

import { motion, AnimatePresence } from "framer-motion";
import { confirmAction } from "./confirmAction";
import { denyAction } from "./denyAction";
import { useChurchStore } from "@/store/useChurchStore";
import { useEffect, useState } from "react";
import { set } from "zod";

type Props = {
  details: notificationDetails;
  type: keyof GroupedNotificationsT;
  nextDate: Date;
  notification: notificationT;
  moveFromList: (
    NotificationId: string,
    onClose: () => void,
    destinationType: keyof GroupedNotificationsT
  ) => void;
  isExpanded: boolean; // new prop
  setExpanded: (id: string) => void; // new prop to set expanded notification in parent
};

export default function NotificationElement({
  details,
  type,
  nextDate,
  notification,
  moveFromList,
  isExpanded,
  setExpanded,
}: Props) {
  const { eventTypes } = useChurchStore();

  const date = new Date(notification.setlist.date);
  const isUpcoming = nextDate <= date;

  const readableDate = date.toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const eventInfo =
    eventTypes?.find((e) => e.key === notification.setlist.event_type) ?? null;

  if (!isUpcoming) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="rounded-lg p-2 cursor-pointer"
      onClick={() => setExpanded(notification.id)}
    >
      <div className="flex items-center gap-4">
        {/* Date display */}

        {/* Content */}
        <div className="relative">
          <motion.div
            layout
            initial={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className=" h-[3.5rem] w-[300px]"
          >
            <div className="font-medium text-gray-900 capitalize">
              <small className="mb-1">
                {date.toLocaleDateString("it-IT", {
                  weekday: "long",
                })}{" "}
                {date.getDate()}{" "}
                {date.toLocaleDateString("it-IT", {
                  month: "short",
                })}{" "}
              </small>
              <br />
              <p>
                {eventInfo?.alt || eventInfo?.label || "Evento sconosciuto"}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Status indicator */}
        <FaCircle size={8} color={details.color} />
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            layout
            initial={{ opacity: 0, height: 0, marginTop: 0, paddingTop: 0 }}
            animate={{
              opacity: 1,
              height: "auto",
              marginTop: 16,
              paddingTop: 16,
            }}
            exit={{ opacity: 0, height: 0, marginTop: 0, paddingTop: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm text-gray-700 ">
              Confermi la tua disponibilità per servire con il{" "}
              <strong>{notification.team.team_name}</strong> il{" "}
              <span className="capitalize">{readableDate}</span>?
            </p>
            <div className="flex gap-3">
              {(type === "confirmed" || type === "pending") && (
                <button
                  className="flex-1 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  onClick={() => {
                    denyAction(notification.id);
                    moveFromList(
                      notification.id,
                      () => setExpanded(null),
                      "denied"
                    );
                  }}
                >
                  Rifiuta
                </button>
              )}
              {(type === "denied" || type === "pending") && (
                <button
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 hover:border-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => {
                    confirmAction(notification.id);
                    moveFromList(
                      notification.id,
                      () => setExpanded(null),
                      "confirmed"
                    );
                  }}
                >
                  Conferma
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
