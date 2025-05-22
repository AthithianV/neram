import { z } from "zod";
import dayjs from "dayjs";

// Regex for 24-hour format "HH:mm"
// Matches "01:30 AM" to "12:59 PM"
const timeStringSchema = z
  .string()
  .regex(/^(0[1-9]|1[0-2]):[0-5]\d\s?(AM|PM)$/i, {
    message: "Invalid time format, expected hh:mm AM/PM",
  });

const WorkunitSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    task: z.string(),
    date: z.date(),
    startTime: timeStringSchema, // Ex: "01:30 PM"
    endTime: timeStringSchema, // Ex: "03:45 PM"
    duration: z.number(),
    break: z.number(),
    tags: z.array(z.string()),
  })
  .refine(
    (data) => {
      const start = dayjs(
        `${dayjs(data.date).format("YYYY-MM-DD")} ${data.startTime}`,
        "YYYY-MM-DD hh:mm A"
      );
      const end = dayjs(
        `${dayjs(data.date).format("YYYY-MM-DD")} ${data.endTime}`,
        "YYYY-MM-DD hh:mm A"
      );

      return end.isAfter(start);
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

export default WorkunitSchema;
