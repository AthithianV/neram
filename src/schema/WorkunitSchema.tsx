import { z } from 'zod';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { setTimezone, getTimeWithTz } from '../lib/time';

dayjs.extend(utc);

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
    })
    .refine((data) => dayjs(data.start_time).isBefore(dayjs(data.end_time)), {
        message: 'Start time must be before end time',
        path: ['start_time'],
    })
    .transform((data) => {
        return {
            ...data,
            start_time: getTimeWithTz(data.start_time, data.date),
            end_time: getTimeWithTz(data.end_time, data.date),
            date: setTimezone(data.date),
        };
    });

export type Workunit = z.infer<typeof WorkunitSchema>;

export default WorkunitSchema;
