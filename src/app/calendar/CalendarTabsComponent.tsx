"use client";

import { useState } from "react";
import { setListT } from "@/utils/types/types";
import { calendarMonth } from "@/utils/types/userData";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
} from "@heroui/react";
import SetlistPage from "../setlist/[setListId]/setlistPage";
import { useChurchStore } from "@/store/useChurchStore";
import clsx from "clsx";

export default function CalendarView({
  months,
  eventsByDate,
}: {
  months: calendarMonth[];
  eventsByDate: Map<string, setListT[]>;
}) {
  const { eventTypes } = useChurchStore();
  const [selectedEvent, setSelectedEvent] = useState<setListT | null>(null);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  return (
    <div className="w-full max-w-[1100px] mx-auto">
      {months.map((month) => {
        const totalCells = month.emptySpaces + month.days.length;
        const rows = Math.ceil(totalCells / 7);

        return (
          <section key={`${month.year}-${month.month}`} className="mb-6">
            {/* Sticky Month Header */}
            <div className="sticky top-0 bg-white z-10 px-4 py-4 ">
              <h2 className="text-[32px] font-semibold text-gray-900 capitalize">
                {month.name} <span className="font-normal">{month.year}</span>
              </h2>
            </div>

            {/* Weekday labels */}
            <div className="grid grid-cols-7 text-center text-xs text-gray-500 capitalize pb-1 px-1">
              {["lun", "mar", "mer", "gio", "ven", "sab", "dom"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            {/* Grid layout for days */}
            <div className="grid grid-cols-7 text-sm border-t border-gray-50">
              {/* Empty leading days */}
              {Array.from({ length: month.emptySpaces }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="min-h-[80px] border border-gray-50 bg-white"
                />
              ))}

              {/* Month days */}
              {month.days.map((day, i) => {
                const colIndex = (month.emptySpaces + i) % 7;
                const isWeekend = colIndex === 5 || colIndex === 6;
                const dateKey = `${month.year}-${month.month}-${day}`;
                const events = eventsByDate.get(dateKey) || [];
                const isToday = dateKey === todayStr;

                return (
                  <div
                    key={dateKey}
                    className={clsx(
                      "min-h-[100px] border-[0.5px] border-gray-100 p-1 relative align-top",
                      isWeekend ? "bg-gray-50" : "bg-white"
                    )}
                  >
                    <div className="text-xs font-medium text-gray-700 absolute top-1 left-1">
                      <span
                        className={clsx(
                          "px-1.5 py-0.5 rounded-full",
                          isToday ? "bg-red-500 text-white" : "text-gray-800"
                        )}
                      >
                        {day}
                      </span>
                    </div>

                    <div className="mt-6 flex flex-col gap-1 overflow-hidden">
                      {events.map((event, idx) => {
                        const matched = eventTypes?.find(
                          (el) => el.key === event.event_type
                        );
                        const color = matched?.color || "#999";

                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedEvent(event)}
                            className="text-[11px] truncate text-left px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: color + "22",
                              color,
                            }}
                          >
                            {matched?.alt || matched?.label || "Evento"}
                          </button>
                        );
                      })}

                      
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Modal */}
      {selectedEvent && (
        <Modal
          scrollBehavior="inside"
          size="4xl"
          placement="center"
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          backdrop="blur"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {selectedEvent.event_title}
                </ModalHeader>
                <ModalBody>
                  <SetlistPage setListId={selectedEvent.id} />
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    fullWidth
                    onPress={() => setSelectedEvent(null)}
                  >
                    Chiudi
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
