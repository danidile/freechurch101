import { z } from "zod";
import { Time } from "@internationalized/date";

export const eventSchema = z.object({
  event_title: z.string().min(1),
  date: z.string(), // formato ISO yyyy-mm-dd
  repetition: z.enum(["settimanale", "alterne"]),
  weekday: z.string(),
  hour: z.instanceof(Time),
  weeks: z.string(),
  months: z.string(),
  monthlyWhen: z.enum(["first", "second", "third", "last"]),
  monthlyWeekday: z.string(),
  monthlyHour: z.instanceof(Time),
});

export type formValues = z.infer<typeof eventSchema>;
