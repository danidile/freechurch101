"use client";
import React, {
  useState,
  useRef,
  useEffect,
  MouseEvent as ReactMouseEvent,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BlockedDate } from "@/utils/types/types";
import { getLocalTimeZone, today } from "@internationalized/date";

type DisabledRange = { start: Date; end: Date };

export interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (range: { start: Date; end: Date }) => void;
  minDate?: Date;
  disabledRanges?: DisabledRange[];
  blockedDates?: BlockedDate[];
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  minDate = today(getLocalTimeZone()).toDate(getLocalTimeZone()), // Default to today
  disabledRanges = [],
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState<"start" | "end" | null>(
    null
  );

  const calendarRef = useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDateDisplay = (date: Date | null) => {
    if (!date) return "Seleziona Data";
    return date.toLocaleDateString("it-IT", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayWeekday = firstDay.getDay();

    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const handleDateClick = (date: Date): void => {
    if (showCalendar === "start") {
      if (endDate && date > endDate) {
        onChange({ start: date, end: date });
        setShowCalendar("end");
      } else {
        onChange({ start: date, end: endDate ?? date });
        setShowCalendar("end");
      }
    } else if (showCalendar === "end") {
      if (startDate && date < startDate) {
        onChange({ start: date, end: startDate });
      } else {
        onChange({ start: startDate ?? date, end: date });
      }
      setShowCalendar(null);
    }
  };

  const isDateInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  };

  const isDateSelected = (date: Date) => {
    return (
      (startDate && date.getTime() === startDate.getTime()) ||
      (endDate && date.getTime() === endDate.getTime())
    );
  };
  const isDateDisabled = (date: Date): boolean => {
    // Check if inside any disabled range
    return disabledRanges.some(
      (range) => date >= range.start && date <= range.end
    );
  };
  const isPast = (date: Date): boolean => {
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const given = new Date(date);
    given.setHours(0, 0, 0, 0);
    return given < todayDate;
  };
  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const days = getDaysInMonth(currentMonth);
  const monthYear = currentMonth.toLocaleDateString("it-IT", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="w-full mx-auto p-3 rounded-lg ">
      {/* Date Inputs */}
      <div className="space-y-3 relative " ref={calendarRef}>
        <p className="my-2 font-medium">Seleziona date inizio e fine:</p>
        <div className="max-w-[300px] mx-auto">
          <button
            onClick={() =>
              setShowCalendar(showCalendar === "start" ? null : "start")
            }
            className="flex flex-row justify-center w-full px-4 py-3 bg-gray-100 rounded-md text-left font-medium  text-gray-900 active:bg-gray-100"
          >
            <p>
              {formatDateDisplay(startDate)}
              {formatDateDisplay(endDate) === "Seleziona Data" ? (
                ""
              ) : (
                <>
                  {" - "}
                  {formatDateDisplay(endDate)}
                </>
              )}
            </p>
          </button>
        </div>
        {/* Calendar */}
        {showCalendar && (
          <div
            className="absolute w-full max-w-[250px] sm:max-w-[280px] md:max-w-[320px] top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-2xl shadow-2xl border-0 z-50 overflow-hidden"
            style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
          >
            {/* Calendar Header - Make it more spacious on mobile */}
            <div className="flex items-center justify-between px-2 sm:px-4 py-3 sm:py-4 border-b border-gray-100">
              <button
                onClick={() => navigateMonth("prev")}
                className="p-2 sm:p-1 m-1 sm:m-2 active:bg-gray-100 rounded-full"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </button>
              <h3 className="font-semibold text-gray-900 text-base sm:text-lg capitalize">
                {monthYear}
              </h3>
              <button
                onClick={() => navigateMonth("next")}
                className="p-2 sm:p-1 m-1 sm:m-2 active:bg-gray-100 rounded-full"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </button>
            </div>

            {/* Calendar Grid - More spacious on mobile */}
            <div className="p-3 sm:p-4 md:p-5">
              {/* Day Headers - Larger on mobile */}
              <div className="grid grid-cols-7 mb-2 sm:mb-3">
                {[...Array(7)].map((_, index) => {
                  const date = new Date(2021, 0, 4 + index);
                  const label = new Intl.DateTimeFormat("it-IT", {
                    weekday: "short",
                  }).format(date);

                  return (
                    <div
                      key={index}
                      className="h-8 sm:h-10 flex items-center justify-center text-xs sm:text-sm font-medium text-gray-400 uppercase"
                    >
                      {label}
                    </div>
                  );
                })}
              </div>

              {/* Calendar Days - Responsive sizing */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {days.map((date, index) => {
                  if (!date)
                    return <div key={index} className="h-8 sm:h-10"></div>;

                  const selected = isDateSelected(date);
                  const inRange = isDateInRange(date);
                  const todayStr = new Date().toDateString();
                  const isToday = date.toDateString() === todayStr;
                  const disabled = isDateDisabled(date);
                  const past = isPast(date);

                  let dayClasses =
                    "h-8 sm:h-10 flex items-center justify-center text-sm sm:text-base relative rounded-sm ";

                  if (disabled) {
                    dayClasses +=
                      "text-red-400 bg-red-50 cursor-not-allowed opacity-50 ";
                  } else if (past) {
                    dayClasses += "text-gray-400 cursor-not-allowed ";
                  } else if (selected) {
                    dayClasses += "bg-gray-900 text-white font-medium ";
                  } else if (inRange) {
                    dayClasses += "bg-gray-100 text-gray-900 ";
                  } else if (isToday) {
                    dayClasses += "text-blue-500 font-semibold ";
                  } else {
                    dayClasses += "text-gray-900 hover:bg-gray-50 ";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => {
                        if (!disabled && !past) handleDateClick(date);
                      }}
                      className={dayClasses}
                      disabled={disabled || past}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default DateRangePicker;
