import { z } from 'zod';
import dayjs from 'dayjs';
import { setTime } from '../lib/time';
import TagSchema from './TagSchema';

const WorkunitSchema = z
    .object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        task: z.string().min(1, 'Task is required'),
        date: z.date(),
        start_time: z.date(),
        end_time: z.date(),
        session_duration: z.number(),
        break_duration: z.number(),
        tags: z.array(TagSchema),
    })
    .refine((data) => dayjs(data.end_time).isAfter(dayjs(data.start_time)), {
        message: 'End time must be after start time',
        path: ['end_time'],
    })
    .refine(
        (data) => {
            return dayjs(dayjs()).isAfter(data.end_time);
        },
        {
            message: 'End time must be before current time',
            path: ['end_time'],
        }
    )
    .refine((data) => dayjs(data.start_time).isBefore(dayjs(data.end_time)), {
        message: 'Start time must be before end time',
        path: ['start_time'],
    })
    .transform((data) => {
        return {
            ...data,
            start_time: setTime(data.start_time, data.date),
            end_time: setTime(data.end_time, data.date),
        };
    });

export type Workunit = z.infer<typeof WorkunitSchema>;

export default WorkunitSchema;
