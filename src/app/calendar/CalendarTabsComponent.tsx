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
import { useChurchStore } from "@/store/useChurchStore";
import {
  IoChevronBackCircleOutline,
  IoChevronForwardCircleOutline,
} from "react-icons/io5";

export default function CalendarTabs({
  months,
  eventsByDate,
}: {
  months: calendarMonth[];
  eventsByDate: Map<string, setListT[]>;
}) {
  const { eventTypes } = useChurchStore();

  const [selectedEvent, setSelectedEvent] = useState<setListT | null>(null);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);

  const currentMonth = months[currentMonthIndex];

  const goPrev = () => {
    setCurrentMonthIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goNext = () => {
    setCurrentMonthIndex((prev) =>
      prev < months.length - 1 ? prev + 1 : prev
    );
  };

  return (
    <div className="flex w-full flex-col max-w-[1300px] mx-auto">
      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onPress={goPrev}
          isIconOnly
          radius="full"
          variant="light"
          disabled={currentMonthIndex === 0}
        >
          <IoChevronBackCircleOutline size={26} />
        </Button>
        <h2 className="text-xl font-bold capitalize">{currentMonth.name}</h2>
        <Button
          isIconOnly
          radius="full"
          variant="light"
          onPress={goNext}
          disabled={currentMonthIndex === months.length - 1}
        >
          <IoChevronForwardCircleOutline size={26} />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {/* Empty placeholders for aligning the first day */}
        {Array.from({ length: currentMonth.emptySpaces }).map((_, index) => (
          <div key={`empty-${index}`} className="calendar-date">
            <div className="calendar-date-empty"></div>
          </div>
        ))}

        {/* Days */}
        {currentMonth.days.map((day) => {
          const dateKey = `${currentMonth.year}-${currentMonth.month}-${day}`;
          const events = eventsByDate.get(dateKey) || [];

          return (
            <div key={dateKey} className="calendar-date">
              <small className="calendar-number">{day}</small>
              {events.length > 0 && (
                <>
                  {events.map((event, index) => {
                    const matched = eventTypes?.find(
                      (el) => el.key === event.event_type
                    );
                    return (
                      <div
                        key={index}
                        className="calendar-event"
                        style={{
                          backgroundColor: matched?.color + "35" || "#efbebe",
                        }}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div
                          style={{
                            left: "0px",
                            height: "100%",
                            width: "2px",
                            backgroundColor: matched?.color,
                            position: "absolute",
                          }}
                        ></div>
                        <small className="calendar-event-title">
                          {matched?.alt ||
                            matched?.label ||
                            "Evento sconosciuto"}
                        </small>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          );
        })}
      </div>

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
