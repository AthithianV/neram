import { z } from 'zod';
import dayjs from 'dayjs';

const WorkunitSchema = z
    .object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        task: z.string(),
        date: z.date(),
        startTime: z.date(),
        endTime: z.date(),
        sessionDuration: z.number(),
        breakDuration: z.number(),
        tags: z.array(z.string()),
    })
    .transform((data) => ({
        ...data,
        startTime: dayjs(data.date)
            .hour(dayjs(data.startTime).hour())
            .minute(dayjs(data.startTime).minute())
            .toDate(),
        endTime: dayjs(data.date)
            .hour(dayjs(data.endTime).hour())
            .minute(dayjs(data.endTime).minute())
            .toDate(),
    }))
    .refine((data) => dayjs(data.endTime).isAfter(dayjs(data.startTime)), {
        message: 'End time must be after start time',
        path: ['endTime'],
    })
    .refine((data) => dayjs(data.endTime).isAfter(dayjs()), {
        message: 'End time must be after current time',
        path: ['endTime'],
    });

export type Workunit = z.infer<typeof WorkunitSchema>;

export default WorkunitSchema;
