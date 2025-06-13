"use client";

import { setListT } from "@/utils/types/types";
import { calendarMonth } from "@/utils/types/userData";
import {
  Tabs,
  Tab,
  Button,
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@heroui/react";
import { useState } from "react";
import SetlistPage from "../setlist/[setListId]/setlistPage";

export default function CalendarTabs({
  months,
  eventsByDate,
}: {
  months: calendarMonth[];
  eventsByDate: Map<string, setListT[]>;
}) {
  const [selectedEvent, setSelectedEvent] = useState<setListT | null>(null);

  return (
    <div className="flex w-full flex-col max-w-[900px] mx-auto pt-3">
      <Tabs
        aria-label="Options"
        color="primary"
        classNames={{
          tabList:
            "gap-4 w-full relative overflow-x-auto overflow-y-hidden scrollbar-hide",
          tab: "flex-shrink-0 w-[31%] data-[selected=true]:bg-black data-[selected=true]:text-white rounded-lg", // Fixed selected state styling
          base: "w-full overflow-x-auto",
          cursor: "bg-transparent", // Remove default selected indicator
          tabContent: "data-[selected=true]:text-white", // Fixed selected text color
        }}
      >
        {months.map(({ name, year, month, days, emptySpaces }) => (
          <Tab key={name} className="capitalize" title={name}>
            <div key={name}>
              <h2 className="text-xl font-bold mb-2 capitalize">{name}</h2>
              <div className="grid grid-cols-7 ">
                {/* Add empty placeholders to align the first day to Monday */}
                {Array.from({ length: emptySpaces }).map((_, index) => (
                  <div key={`empty-${name}-${index}`} className="calendar-date">
                    <div className="calendar-date-empty"></div>
                  </div>
                ))}
                {/* Render days */}
                {days.map((day) => {
                  const dateKey = `${year}-${month}-${day}`;
                  const events = eventsByDate.get(dateKey) || [];

                  return (
                    <div key={dateKey} className="calendar-date">
                      <small className="calendar-number">{day}</small>
                      {events.length > 0 && (
                        <>
                          {events.map((event, index) => (
                            <div
                              className="calendar-event"
                              style={{
                                backgroundColor:
                                  event.color + "35" || "#efbebe",
                              }}
                              onClick={() => setSelectedEvent(event)}
                            >
                              <div
                                style={{
                                  left: "0px",
                                  height: "100%",
                                  width: "2px",
                                  backgroundColor: event.color,
                                  position: "absolute",
                                }}
                              ></div>
                              <small
                                key={index}
                                className="calendar-event-title"
                              >
                                {event.event_title || "Untitled Event"}
                              </small>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  );
                })}
                {selectedEvent && (
                  <Modal
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
            </div>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
