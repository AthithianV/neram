import { z } from 'zod';
import dayjs from 'dayjs';

const SessionSchema = z
    .object({
        title: z.string().optional(),
        description: z.string().optional(),
        task_id: z.number(),
        project_id: z.number(),
        date: z.string(),
        start_time: z.string(),
        end_time: z.string(),
        session_duration_sec: z.number(),
        break_duration_sec: z.number(),
        tags: z.array(z.number()),
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
    });

export type Session = z.infer<typeof SessionSchema> & { id?: number };
export type CreateSessionType = Omit<
    Session,
    'date' | 'start_time' | 'end_time'
> & { date: string; start_time: string; end_time: string };

export default SessionSchema;
