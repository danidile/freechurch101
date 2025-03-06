import { getSetListsByChurch } from "@/hooks/GET/getSetListsByChurch";
import fbasicUserData from "@/utils/supabase/getUserData";
import { setListT } from "@/utils/types/types";
import { basicUserData } from "@/utils/types/userData";

export default async function Page() {
  const userData: basicUserData = await fbasicUserData();
  const setlists: setListT[] = await getSetListsByChurch(userData.church_id);
  const today = new Date();
  const months = [];

  // Convert event dates into a Set for quick lookup
  const eventDays = new Set(
    setlists.map((event) => {
      const eventDate = new Date(event.date!);
      return `${eventDate.getFullYear()}-${eventDate.getMonth()}-${eventDate.getDate()}`;
    })
  );

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
    <div className="flex flex-col gap-6 p-4">
      {months.map(({ name, year, month, days, emptySpaces }) => (
        <div key={name}>
          <h2 className="text-xl font-bold mb-2">{name}</h2>
          <div className="grid grid-cols-7 gap-4">
            {/* Add empty placeholders to align the first day to Monday */}
            {Array.from({ length: emptySpaces }).map((_, index) => (
              <div key={`empty-${name}-${index}`} className="w-12 h-12"></div>
            ))}

            {/* Render days */}
            {days.map((day) => {
              const dateKey = `${year}-${month}-${day}`;
              const isEventDay = eventDays.has(dateKey);

              return (
                <div
                  key={dateKey}
                  className={`calendar-date ${
                    isEventDay
                      ? "calendar-date-selected"
                      : "calendar-date-not-selected"
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
