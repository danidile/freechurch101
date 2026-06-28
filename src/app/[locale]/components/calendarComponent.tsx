"use client";
import { setListT } from "@/utils/types/types";
import { basicUserData, calendarMonth } from "@/utils/types/userData";
import CalendarView from "./CalendarTabsComponent";

export default function CalendarComponent({
  setlists,
  userData,
  viewMode,
}: {
  setlists: setListT[];
  userData: basicUserData;
  viewMode?: string;
}) {
  const today = new Date();
  const months: calendarMonth[] = [];
  const eventsByDate = new Map<string, setListT[]>();

  if (setlists?.length) {
    for (const event of setlists) {
      const date = new Date(event.date!);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      if (!eventsByDate.has(key)) {
        eventsByDate.set(key, []);
      }
      eventsByDate.get(key)!.push(event);
    }
  }

  // Past 6 months, current month, and next 11 months (used by compact preview)
  for (let i = -6; i < 12; i++) {
    const currentMonth = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const monthName = currentMonth.toLocaleString("default", { month: "long" });
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const emptySpaces = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    const days = Array.from({ length: totalDays }, (_, j) => j + 1);
    months.push({ name: monthName, year, month, days, emptySpaces });
  }

  let monthsToDisplay = months;
  if (viewMode === "compact") {
    const monthsWithEvents = new Set<string>();
    for (const event of setlists) {
      const date = new Date(event.date!);
      monthsWithEvents.add(`${date.getFullYear()}-${date.getMonth()}`);
    }
    monthsToDisplay = months.filter((month) =>
      monthsWithEvents.has(`${month.year}-${month.month}`),
    );
  }

  return (
    <CalendarView
      months={monthsToDisplay}
      eventsByDate={eventsByDate}
      viewMode={viewMode}
      setlists={setlists}
    />
  );
}
