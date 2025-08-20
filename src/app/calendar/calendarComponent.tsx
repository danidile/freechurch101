"use client";
import { getSetListsByChurch } from "@/hooks/GET/getSetListsByChurch";
import { setListT } from "@/utils/types/types";
import { calendarMonth } from "@/utils/types/userData";
import CalendarTabs from "./CalendarTabsComponent";
import { useUserStore } from "@/store/useUserStore";
import { useState, useEffect, useRef } from "react";
import { Spinner } from "@heroui/spinner";
import CalendarView from "./CalendarTabsComponent";

export default function CalendarComponent() {
  const { userData, loading } = useUserStore();
  const [setlists, setSetlists] = useState<any[] | null>(null);
  const currentMonthRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && userData.loggedIn) {
      getSetListsByChurch(userData.church_id).then((fetchedSetlists) => {
        setSetlists(fetchedSetlists);
      });
    }
  }, [loading, userData]);

  const today = new Date();
  const months: calendarMonth[] = [];
  let eventsByDate = new Map<string, setListT[]>();

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

  // Loop for past 6 months, current month, and next 11 months (total 18 months)
  for (let i = -6; i < 12; i++) {
    const currentMonth = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const monthName = currentMonth.toLocaleString("default", { month: "long" });
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay(); // Get which weekday the 1st falls on (0=Sunday, 6=Saturday)

    // Calculate how many empty spaces to add before the 1st to start on Monday
    const emptySpaces = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Convert Sunday (0) to last position

    // Generate days
    const days = Array.from({ length: totalDays }, (_, j) => j + 1);

    // Mark current month for scrolling reference
    const isCurrentMonth = i === 0;

    months.push({
      name: monthName,
      year,
      month,
      days,
      emptySpaces,
      isCurrentMonth, // Add this property to identify current month
    });
  }

  return (
    <CalendarView
      months={months}
      eventsByDate={eventsByDate}
      currentMonthRef={currentMonthRef}
    />
  );
}
