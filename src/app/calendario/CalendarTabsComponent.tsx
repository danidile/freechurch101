"use client";

import { setListT } from "@/utils/types/types";
import { calendarMonth } from "@/utils/types/userData";
import {
  Tabs,
  Tab,
  useDisclosure,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
} from "@heroui/react";

export default function CalendarTabs({
  months,
  eventsByDate,
}: {
  months: calendarMonth[];
  eventsByDate: Map<string, setListT[]>;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex w-full flex-col max-w-[900px] mx-auto pt-3">
      <Tabs
        aria-label="Options"
        color="primary"
        classNames={{
          tabList:
            "gap-4 w-full relative overflow-x-auto overflow-y-hidden scrollbar-hide",
          tab: "flex-shrink-0 w-auto data-[selected=true]:bg-black data-[selected=true]:text-white rounded-lg", // Fixed selected state styling
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
                              className="calendar-event calendar-date-selected"
                              onClick={onOpen}
                            >
                              <small
                                key={index}
                                className="calendar-event-title"
                              >
                                {event.event_title || "Untitled Event"}
                              </small>
                              <Drawer
                                backdrop="opaque"
                                isOpen={isOpen}
                                onOpenChange={onOpenChange}
                              >
                                <DrawerContent>
                                  {(onClose) => (
                                    <>
                                      <DrawerHeader className="flex flex-col gap-1"> {event.event_title}</DrawerHeader>
                                      <DrawerBody>
                                        <p>
                                        {event.date}
                                        </p>
                                        <p>
                                          Lorem ipsum dolor sit amet,
                                          consectetur adipiscing elit. Nullam
                                          pulvinar risus non risus hendrerit
                                          venenatis. Pellentesque sit amet
                                          hendrerit risus, sed porttitor quam.
                                        </p>
                                        <p>
                                          Magna exercitation reprehenderit magna
                                          aute tempor cupidatat consequat elit
                                          dolor adipisicing. Mollit dolor
                                          eiusmod sunt ex incididunt cillum
                                          quis. Velit duis sit officia eiusmod
                                          Lorem aliqua enim laboris do dolor
                                          eiusmod. Et mollit incididunt nisi
                                          consectetur esse laborum eiusmod
                                          pariatur proident Lorem eiusmod et.
                                          Culpa deserunt nostrud ad veniam.
                                        </p>
                                      </DrawerBody>
                                      <DrawerFooter>
                                        <Button
                                          color="danger"
                                          variant="light"
                                          onPress={onClose}
                                        >
                                          Close
                                        </Button>
                                        <Button
                                          color="primary"
                                          onPress={onClose}
                                        >
                                          Action
                                        </Button>
                                      </DrawerFooter>
                                    </>
                                  )}
                                </DrawerContent>
                              </Drawer>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
