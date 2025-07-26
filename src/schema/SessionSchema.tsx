import dayjs from 'dayjs';
import { z } from 'zod';

const BaseSessionSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional().nullable(),
    project_id: z.number(),
    date: z.string(),
    start_time: z.string(),
    end_time: z.string().optional().nullable(),
    session_duration_sec: z.number(),
    break_duration_sec: z.number(),
    tags: z.array(z.number()),
});

export const CreateSessionSchema = BaseSessionSchema.refine(
    (data) => dayjs(data.date).isBefore(dayjs()),
    {
        message: 'Date must not be in future',
        path: ['date'],
    },
)
    .refine(
        (data) => {
            return data.end_time
                ? dayjs(data.end_time).isAfter(dayjs(data.start_time))
                : true;
        },
        {
            message: 'End time must be after start time',
            path: ['end_time'],
        },
    )
    .refine(
        (data) => {
            return data.end_time
                ? dayjs(data.end_time).diff(dayjs(data.start_time), 'second') ===
                      data.session_duration_sec + data.break_duration_sec
                : true;
        },
        {
            message: 'Time difference must match duration + break',
            path: ['session_duration_sec'],
        },
    )
    .refine(
        (data) => {
            return data.end_time ? dayjs().isAfter(data.end_time) : true;
        },
        {
            message: 'End time must be before now',
            path: ['end_time'],
        },
    );

export const UpdateSessionSchema = BaseSessionSchema;
export type Session = z.infer<typeof BaseSessionSchema> & { id: number };
export type UpdateSession = z.infer<typeof UpdateSessionSchema>;
export type CreateSession = z.infer<typeof CreateSessionSchema>;
