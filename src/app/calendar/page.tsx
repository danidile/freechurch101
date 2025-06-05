import { getSetListsByChurch } from "@/hooks/GET/getSetListsByChurch";
import fbasicUserData from "@/utils/supabase/getUserData";
import { setListT } from "@/utils/types/types";
import { basicUserData, calendarMonth } from "@/utils/types/userData";
import { Tabs, Tab, Card, CardBody, RadioGroup, Radio } from "@heroui/react";
import CalendarTabs from "./CalendarTabsComponent";

export default async function CalendarPage() {
  const userData: basicUserData = await fbasicUserData();
  const setlists: setListT[] = await getSetListsByChurch(userData.church_id);
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

  // Loop for the next 3 months
  for (let i = 0; i < 3; i++) {
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

    months.push({ name: monthName, year, month, days, emptySpaces });
  }

  return (
    <CalendarTabs months={months} eventsByDate={eventsByDate}></CalendarTabs>
  );
}
