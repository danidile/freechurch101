import { z } from "zod";
import { Time } from "@internationalized/date";

export const eventSchema = z.union([
  // Schema for "settimanale" (weekly) tab
  z.object({
    event_type: z.string().min(1),
    date: z.string(),
    weeklyTime: z.instanceof(Time),
    weeklyRepeatType: z.enum(["settimanale", "alterne"]),
    weekday: z.string(),
    repetition: z.string(), // Renamed from "weeks" to match your form
  }).partial().required({
    event_type: true,
    date: true,
    weeklyTime: true,
    weeklyRepeatType: true,
    weekday: true,
    repetition: true,
  }),

  // Schema for "monthly" (monthly) tab
  z.object({
    event_type: z.string().min(1),
    date: z.string(),
    monthlyTime: z.instanceof(Time),
    monthOrder: z.enum(["first", "second", "third", "last"]),
    monthlyWeekday: z.string(), // Renamed to match the form
    repetition: z.string(), // Renamed from "months" to match your form
  }).partial().required({
    event_type: true,
    date: true,
  
    monthlyTime: true,
    monthOrder: true,
    monthlyWeekday: true,
    repetition: true,
  }),
]);

export type formValues = z.infer<typeof eventSchema>;