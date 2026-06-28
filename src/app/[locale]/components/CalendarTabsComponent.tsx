"use client";

import { useEffect, useRef, useState } from "react";
import { setListT } from "@/utils/types/types";
import { calendarMonth } from "@/utils/types/userData";

import { useChurchStore } from "@/store/useChurchStore";
import { useUserStore } from "@/store/useUserStore";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, Clock, X } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import SetListTabs from "./SetListTabsComponent";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { Button } from "@heroui/button";
import { FaPlus } from "react-icons/fa";

const WEEKDAYS = ["lun", "mar", "mer", "gio", "ven", "sab", "dom"];

/* ── Compact preview grid (add-multiple-events modal) ── */
function MonthGridCompact({
  month,
  eventsByDate,
}: {
  month: calendarMonth;
  eventsByDate: Map<string, setListT[]>;
}) {
  const { eventTypes } = useChurchStore();
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-default-700 capitalize mb-1 px-1">
        {month.name} {month.year}
      </h3>
      <div className="grid grid-cols-7 text-center text-[10px] text-default-400 mb-1">
        {WEEKDAYS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-divider rounded-lg overflow-hidden border border-divider">
        {Array.from({ length: month.emptySpaces ?? 0 }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-content1 min-h-[64px]" />
        ))}
        {(month.days ?? []).map((day) => {
          const dateKey = `${month.year}-${month.month}-${day}`;
          const events = eventsByDate.get(dateKey) || [];
          return (
            <div key={dateKey} className="bg-content1 min-h-[64px] p-1">
              <div className="text-[10px] text-default-500 text-right">{day}</div>
              <div className="mt-0.5 flex flex-col gap-0.5">
                {events.slice(0, 2).map((event, idx) => {
                  const matched = eventTypes?.find(
                    (el) => el.key === event.event_type,
                  );
                  const color = matched?.color || "#999";
                  return (
                    <div
                      key={idx}
                      className="text-[9px] leading-tight px-1 rounded truncate"
                      style={{ backgroundColor: color + "22", color }}
                    >
                      {matched?.alt || matched?.label || "Evento"}
                    </div>
                  );
                })}
                {events.length > 2 && (
                  <div className="text-[9px] text-default-400">
                    +{events.length - 2}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── One month in the scrollable view (minimal, interactive) ── */
function MonthSection({
  month,
  eventsByDate,
  todayStr,
  onDayClick,
  sectionRef,
}: {
  month: calendarMonth;
  eventsByDate: Map<string, setListT[]>;
  todayStr: string;
  onDayClick: (dateKey: string, day: number, month: calendarMonth) => void;
  sectionRef?: React.Ref<HTMLDivElement>;
}) {
  const { eventTypes } = useChurchStore();
  return (
    <div ref={sectionRef} className="mb-3">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-2">
        <h3 className="text-base font-semibold text-default-800 capitalize">
          {month.name}{" "}
          <span className="font-normal text-default-400">{month.year}</span>
        </h3>
      </div>
      <div className="grid grid-cols-7 text-center text-[11px] text-default-400 mb-1">
        {WEEKDAYS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: month.emptySpaces ?? 0 }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {(month.days ?? []).map((day) => {
          const dateKey = `${month.year}-${month.month}-${day}`;
          const events = eventsByDate.get(dateKey) || [];
          const isToday = dateKey === todayStr;
          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onDayClick(dateKey, day, month)}
              title={
                events.length
                  ? events
                      .map((e) => {
                        const m = eventTypes?.find(
                          (el) => el.key === e.event_type,
                        );
                        return m?.alt || m?.label || "Evento";
                      })
                      .join(", ")
                  : undefined
              }
              className="group min-h-[54px] rounded-xl flex flex-col items-center pt-1.5 gap-1 transition-all hover:bg-default-100 active:scale-[0.96]"
            >
              <span
                className={clsx(
                  "text-xs w-7 h-7 flex items-center justify-center rounded-full transition-colors",
                  isToday
                    ? "bg-primary text-white font-semibold"
                    : events.length
                      ? "text-default-800 font-medium group-hover:text-primary"
                      : "text-default-500",
                )}
              >
                {day}
              </span>
              {events.length > 0 && (
                <span className="flex items-center justify-center gap-0.5 flex-wrap px-0.5">
                  {events.slice(0, 4).map((event, idx) => {
                    const matched = eventTypes?.find(
                      (el) => el.key === event.event_type,
                    );
                    return (
                      <span
                        key={idx}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: matched?.color || "#999" }}
                      />
                    );
                  })}
                  {events.length > 4 && (
                    <span className="text-[9px] text-default-400 leading-none">
                      +{events.length - 4}
                    </span>
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function CalendarView({
  months,
  eventsByDate,
  viewMode,
  setlists,
}: {
  months: calendarMonth[];
  eventsByDate: Map<string, setListT[]>;
  currentMonthRef?: React.RefObject<HTMLDivElement>;
  viewMode?: string;
  setlists?: setListT[];
}) {
  const { userData } = useUserStore();
  const router = useRouter();

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  const todayY = today.getFullYear();
  const todayM = today.getMonth();

  const [view, setView] = useState<"month" | "agenda">("month");
  const [dayViewDate, setDayViewDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLDivElement>(null);

  // Jump to the current month on first render
  useEffect(() => {
    const c = scrollRef.current;
    const s = currentRef.current;
    if (c && s) c.scrollTop = s.offsetTop;
  }, [months.length, view]);

  // Lock body scroll while the day-detail overlay is open
  useEffect(() => {
    document.body.style.overflow = dayViewDate ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [dayViewDate]);

  // ── Compact preview: static stacked months ──
  if (viewMode === "compact") {
    return (
      <div className="w-full">
        {months.map((month) => (
          <MonthGridCompact
            key={`${month.year}-${month.month}`}
            month={month}
            eventsByDate={eventsByDate}
          />
        ))}
      </div>
    );
  }

  const handleDateClick = (
    dateKey: string,
    day: number,
    month: calendarMonth,
  ) => {
    const events = eventsByDate.get(dateKey) || [];
    if (events.length === 1) {
      router.push(`/setlist/${events[0].id}`);
      return;
    }
    setDayViewDate(new Date(month.year!, month.month!, day));
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
    setSelectedDate(
      `${newDate.getFullYear()}-${newDate.getMonth()}-${newDate.getDate()}`,
    );
  };

  const goToday = () => {
    const c = scrollRef.current;
    const s = currentRef.current;
    if (c && s) c.scrollTo({ top: s.offsetTop, behavior: "smooth" });
  };

  const formatDayViewDate = (date: Date) =>
    date.toLocaleDateString("it-IT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const dayViewEvents = selectedDate
    ? eventsByDate.get(selectedDate) || []
    : [];

  return (
    <div className="w-full max-w-[1100px] mx-auto px-2 sm:px-4 py-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <Button size="sm" variant="flat" onPress={goToday}>
          Oggi
        </Button>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-divider p-0.5 bg-default-50">
            <button
              onClick={() => setView("month")}
              className={clsx(
                "px-3 py-1 text-sm rounded-md transition-colors",
                view === "month"
                  ? "bg-primary text-white"
                  : "text-default-500 hover:text-default-700",
              )}
            >
              Mese
            </button>
            <button
              onClick={() => setView("agenda")}
              className={clsx(
                "px-3 py-1 text-sm rounded-md transition-colors",
                view === "agenda"
                  ? "bg-primary text-white"
                  : "text-default-500 hover:text-default-700",
              )}
            >
              Agenda
            </button>
          </div>

          {hasPermission(userData?.role as Role, "create:setlists") && (
            <Button
              isIconOnly
              size="sm"
              color="primary"
              variant="flat"
              as={Link}
              href="/setlist/addSetlist"
              aria-label="Nuovo evento"
            >
              <FaPlus size={13} />
            </Button>
          )}
        </div>
      </div>

      {/* Body */}
      {view === "month" ? (
        <div
          ref={scrollRef}
          className="relative max-h-[78vh] overflow-y-auto pr-1"
        >
          {months.map((month) => {
            const isCurrent = month.year === todayY && month.month === todayM;
            return (
              <MonthSection
                key={`${month.year}-${month.month}`}
                month={month}
                eventsByDate={eventsByDate}
                todayStr={todayStr}
                onDayClick={handleDateClick}
                sectionRef={isCurrent ? currentRef : undefined}
              />
            );
          })}
        </div>
      ) : (
        <div className="max-h-[78vh] overflow-y-auto">
          <SetListTabs userData={userData} setlists={setlists || []} />
        </div>
      )}

      {/* Day detail overlay */}
      {dayViewDate && selectedDate && (
        <div className="fixed inset-0 bg-background z-50 flex flex-col">
          <div className="border-b border-divider px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={closeDayView}
                className="p-2 hover:bg-default-100 rounded-full transition-colors"
                aria-label="Chiudi"
              >
                <X size={20} className="text-default-600" />
              </button>
              <h5 className="font-semibold text-default-900 capitalize truncate">
                {formatDayViewDate(dayViewDate)}
              </h5>
              {selectedDate === todayStr && (
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                  Oggi
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateDay("prev")}
                className="p-2 hover:bg-default-100 rounded-full transition-colors"
                aria-label="Giorno precedente"
              >
                <ChevronLeft size={20} className="text-default-600" />
              </button>
              <button
                onClick={() => navigateDay("next")}
                className="p-2 hover:bg-default-100 rounded-full transition-colors"
                aria-label="Giorno successivo"
              >
                <ChevronRight size={20} className="text-default-600" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <div className="max-w-4xl mx-auto p-6">
              {dayViewEvents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-default-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock size={32} className="text-default-400" />
                  </div>
                  <h3 className="text-lg font-medium text-default-900 mb-2">
                    Nessun evento programmato
                  </h3>
                  <p className="text-default-500">
                    Non ci sono eventi per questa giornata.
                  </p>
                  {hasPermission(userData?.role as Role, "create:setlists") && (
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
                  <h2 className="text-lg font-medium text-default-900 mb-4">
                    Eventi ({dayViewEvents.length})
                  </h2>
                  <SetListTabs
                    viewMode="calendar"
                    userData={userData}
                    setlists={dayViewEvents}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
