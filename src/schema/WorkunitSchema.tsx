import { z } from "zod";
import dayjs from "dayjs";

// Regex for 24-hour format "HH:mm"
const timeStringSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
  message: "Invalid time format, expected HH:mm",
});

const WorkunitSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    task: z.string(),
    date: z.date(),
    startTime: timeStringSchema,
    endTime: timeStringSchema,
    duration: z.number(),
    break: z.number(),
    tags: z.array(z.string()),
  })
  .refine(
    (data) => {
      const start = dayjs(
        `${dayjs(data.date).format("YYYY-MM-DD")}T${data.startTime}`
      );
      const end = dayjs(
        `${dayjs(data.date).format("YYYY-MM-DD")}T${data.endTime}`
      );
      return end.isAfter(start);
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

export default WorkunitSchema;
