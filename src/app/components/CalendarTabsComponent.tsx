"use client";

import { useState, useEffect, useRef } from "react";
import { setListT } from "@/utils/types/types";
import { calendarMonth } from "@/utils/types/userData";

import { useChurchStore } from "@/store/useChurchStore";
import { useUserStore } from "@/store/useUserStore";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, Clock, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SetListTabs from "./SetListTabsComponent";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { Button } from "@heroui/button";
import { FaPlus } from "react-icons/fa";

export default function CalendarView({
  months,
  eventsByDate,
  currentMonthRef,
  viewMode,
}: {
  months: calendarMonth[];
  eventsByDate: Map<string, setListT[]>;
  currentMonthRef?: React.RefObject<HTMLDivElement>;
  viewMode: string;
}) {
  const { eventTypes } = useChurchStore();
  const { userData } = useUserStore();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dayViewDate, setDayViewDate] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to current month within the container
  useEffect(() => {
    if (currentMonthRef?.current && containerRef.current) {
      const container = containerRef.current;
      const currentMonth = currentMonthRef.current;

      // Calculate the scroll position relative to the container
      const containerTop = container.offsetTop;
      const currentMonthTop = currentMonth.offsetTop;
      const scrollPosition = currentMonthTop - containerTop;

      container.scrollTo({
        top: scrollPosition,
        behavior: "auto",
      });
    }
  }, [months.length]); // Trigger when months are loaded

  // Block/unblock body scroll when day view is open
  useEffect(() => {
    if (dayViewDate) {
      // Block scroll
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "0px"; // Prevent layout shift
    } else {
      // Restore scroll
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    // Cleanup function to restore scroll if component unmounts
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [dayViewDate]);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  const handleDateClick = (
    dateKey: string,
    day: number,
    month: calendarMonth
  ) => {
    const events = eventsByDate.get(dateKey) || [];

    // If there's only one event, navigate directly to it
    if (events.length === 1) {
      const event = events[0];
      router.push(`/setlist/${event.id}`); // Adjust the path according to your routing structure
      return;
    }

    // Otherwise, open the day view as before
    const clickedDate = new Date(month.year, month.month, day);
    setDayViewDate(clickedDate);
    setSelectedDate(dateKey);
  };

  const closeDayView = () => {
    setDayViewDate(null);
    setSelectedDate(null);
  };

  const navigateDay = (direction: "prev" | "next") => {
    if (!dayViewDate) return;

    const newDate = new Date(dayViewDate);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    setDayViewDate(newDate);

    const newDateKey = `${newDate.getFullYear()}-${newDate.getMonth()}-${newDate.getDate()}`;
    setSelectedDate(newDateKey);
  };

  const formatDayViewDate = (date: Date) => {
    return date.toLocaleDateString("it-IT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDayViewEvents = () => {
    if (!selectedDate) return [];
    const events = eventsByDate.get(selectedDate) || [];
    return events;
  };
  // Day View Component
  const DayView = () => {
    if (!dayViewDate || !selectedDate) return null;

    const events = getDayViewEvents();
    const isToday = selectedDate === todayStr;

    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={closeDayView}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
            <h5 className="font-semibold text-gray-900 capitalize truncate whitespace-nowrap">
              {formatDayViewDate(dayViewDate)}
            </h5>
            {isToday && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                Oggi
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateDay("prev")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <button
              onClick={() => navigateDay("next")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-6">
            {events.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nessun evento programmato
                </h3>
                <p className="text-gray-500">
                  Non ci sono eventi per questa giornata.
                </p>
                {hasPermission(userData.role as Role, "create:setlists") && (
                  <Button
                    className="my-6 text-white"
                    color="primary"
                    variant="solid"
                    as={Link}
                    prefetch
                    href="/setlist/addSetlist"
                  >
                    Aggiungi evento <FaPlus />
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Eventi ({events.length})
                </h2>
                <SetListTabs
                  viewMode="calendar"
                  userData={userData}
                  setlists={events}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        ref={containerRef}
        className="w-full max-w-[1100px] mx-auto h-screen overflow-y-auto"
      >
        {months.map((month) => {
          const totalCells = month.emptySpaces + month.days.length;
          const rows = Math.ceil(totalCells / 7);
          const isCurrentMonth = month.isCurrentMonth;

          return (
            <section
              key={`${month.year}-${month.month}`}
              className="mb-6"
              ref={isCurrentMonth ? currentMonthRef : null}
            >
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
                        "min-h-[100px] border-[0.5px] border-gray-100 p-[2px] relative align-top cursor-pointer hover:bg-gray-50 transition-colors"
                      )}
                      onClick={() => {
                        if (viewMode !== "compact") {
                          handleDateClick(dateKey, day, month);
                        }
                      }}
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
                        {events.slice(0, 3).map((event, idx) => {
                          const matched = eventTypes?.find(
                            (el) => el.key === event.event_type
                          );
                          const color = matched?.color || "#999";
                          return (
                            <div
                              key={idx}
                              className="relative text-[10px] text-left cursor-pointer px-1 py-0.5 rounded-[3px] hover:opacity-80 transition-opacity whitespace-nowrap overflow-hidden max-w-[120px]"
                              style={{
                                backgroundColor: color + "22",
                                color,
                              }}
                            >
                              <span className="pr-6">
                                {matched?.alt || matched?.label || "Evento"}
                              </span>
                            </div>
                          );
                        })}

                        {events.length > 3 && (
                          <div className="text-[10px] text-gray-500 px-2 py-0.5">
                            +{events.length - 3} altri
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Day View */}
      {dayViewDate && <DayView />}
    </>
  );
}
