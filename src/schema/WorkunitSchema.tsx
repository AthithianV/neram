import { z } from 'zod';
import dayjs from 'dayjs';

const WorkunitSchema = z
    .object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        task: z.string(),
        date: z.date(),
        start_time: z.date(),
        end_time: z.date(),
        session_duration: z.number(),
        break_duration: z.number(),
        tags: z.array(z.string()),
    })
    .transform((data) => ({
        ...data,
        start_time: dayjs(data.date)
            .hour(dayjs(data.start_time).hour())
            .minute(dayjs(data.start_time).minute())
            .toDate(),
        end_time: dayjs(data.date)
            .hour(dayjs(data.end_time).hour())
            .minute(dayjs(data.end_time).minute())
            .toDate(),
    }))
    .refine((data) => dayjs(data.end_time).isAfter(dayjs(data.start_time)), {
        message: 'End time must be after start time',
        path: ['end_time'],
    })
    .refine((data) => dayjs(data.end_time).isBefore(dayjs()), {
        message: 'End time must be after current time',
        path: ['end_time'],
    });

export type Workunit = z.infer<typeof WorkunitSchema>;

export default WorkunitSchema;
