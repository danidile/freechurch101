import { Time } from "@internationalized/date";
import { formValues } from "./types";

/**
 * Maps weekday keys to their corresponding numerical representation (0 for Sunday, 1 for Monday, etc.).
 */
const dayMap: { [key: string]: number } = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

/**
 * Generates an array of weekly recurring events.
 * @param data - The form data for weekly recurrence.
 * @param startDate - The starting date for event generation.
 * @returns An array of event objects.
 */
const createWeeklyEvents = (data: formValues, startDate: Date) => {
  const events: { event_type: string; date: string }[] = [];

  if (!("weeklyTime" in data) || !data.weeklyTime) {
    console.warn("Weekly time is missing from form data.");
    return events;
  }

  const startTime = data.weeklyTime as Time;
  const repetitionCount = parseInt(data.repetition);
  const weekdayKey = data.weekday;
  const targetDay = dayMap[weekdayKey as keyof typeof dayMap];
  const weekMultiplier = data.weeklyRepeatType === "alterne" ? 2 : 1;

  // Find the first occurrence of the selected weekday from the start date
  let firstEventDate = new Date(startDate);
  let daysToAdd = targetDay - firstEventDate.getDay();
  if (daysToAdd < 0) {
    daysToAdd += 7;
  }
  firstEventDate.setDate(firstEventDate.getDate() + daysToAdd);

  for (let i = 0; i < repetitionCount; i++) {
    const eventDate = new Date(firstEventDate);
    eventDate.setDate(eventDate.getDate() + i * weekMultiplier * 7);

    // FIX: Use setUTCHours to prevent time zone from shifting the date
    eventDate.setUTCHours(startTime.hour, startTime.minute, 0, 0);

    events.push({
      event_type: data.event_type,
      date: eventDate.toISOString(),
    });
  }

  return events;
};

//-----------------------------------------------------------------------------

/**
 * Helper function to find the Nth or last weekday of a month.
 * @param date - A Date object for the month to search.
 * @param targetDay - The numerical day of the week (0-6).
 * @param monthOrder - The occurrence order ("first", "second", "third", "last").
 * @returns A Date object for the found date, or null if not found.
 */
const findMonthlyDate = (
  date: Date,
  targetDay: number,
  monthOrder: string
): Date | null => {
  if (monthOrder === "last") {
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    for (let d = lastDayOfMonth.getDate(); d >= 1; d--) {
      const dateToCheck = new Date(date.getFullYear(), date.getMonth(), d);
      if (dateToCheck.getDay() === targetDay) {
        return dateToCheck;
      }
    }
  } else {
    let occurrenceCount = 0;
    const targetOccurrence =
      monthOrder === "first" ? 1 : monthOrder === "second" ? 2 : 3;

    for (let d = 1; d <= 31; d++) {
      const dateToCheck = new Date(date.getFullYear(), date.getMonth(), d);
      if (dateToCheck.getMonth() !== date.getMonth()) {
        break;
      }
      if (dateToCheck.getDay() === targetDay) {
        occurrenceCount++;
        if (occurrenceCount === targetOccurrence) {
          return dateToCheck;
        }
      }
    }
  }
  return null;
};

/**
 * Generates an array of monthly recurring events.
 * @param data - The form data for monthly recurrence.
 * @param startDate - The starting date for event generation.
 * @returns An array of event objects.
 */
const createMonthlyEvents = (data: formValues, startDate: Date) => {
  const events: { event_type: string; date: string }[] = [];

  if (!("monthlyTime" in data) || !data.monthlyTime) {
    console.warn("Monthly time is missing from form data.");
    return events;
  }

  const startTime = data.monthlyTime as Time;
  const repetitionCount = parseInt(data.repetition);
  const weekdayKey = data.monthlyWeekday;
  const targetDay = dayMap[weekdayKey as keyof typeof dayMap];
  const monthOrder = data.monthOrder;

  // FIX: Start the loop from the current month of the user's start date
  let currentMonth = startDate.getMonth();
  let currentYear = startDate.getFullYear();
  let eventsFound = 0;

  while (eventsFound < repetitionCount) {
    const currentDate = new Date(currentYear, currentMonth, 1);
    const foundDate = findMonthlyDate(currentDate, targetDay, monthOrder);

    if (foundDate && foundDate >= startDate) {
      // Found a valid date on or after the start date
      foundDate.setUTCHours(startTime.hour, startTime.minute, 0, 0);
      events.push({
        event_type: data.event_type,
        date: foundDate.toISOString(),
      });
      eventsFound++;
    }

    // Move to the next month for the next iteration
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
  }

  return events;
};

//-----------------------------------------------------------------------------

/**
 * Creates an array of event objects based on weekly or monthly recurrence rules.
 * @param data - The form data containing all user inputs.
 * @param type - The selected tab type ('settimanale' or 'monthly').
 * @returns An array of event objects, each with a date and event type.
 */
export const createEventsArray = (data: formValues, type: string) => {
  // Parse the date string safely to prevent timezone issues
  const [year, month, day] = data.date.split("-");
  const startDate = new Date(Number(year), Number(month) - 1, Number(day));

  if (type === "settimanale") {
    return createWeeklyEvents(data, startDate);
  } else if (type === "monthly") {
    return createMonthlyEvents(data, startDate);
  }

  return [];
};
