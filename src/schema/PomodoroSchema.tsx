import z from 'zod';

export const PomodoroSettingsSchema = z.object({
    session_duration: z
        .number()
        .min(10, 'Minimum is 10 minutes')
        .max(120, 'Maximum is 120 minutes'),
    session_count: z
        .number()
        .min(2, 'Minimum 2 sessions')
        .max(10, 'Maximum 10 sessions'),
    break_duration: z
        .number()
        .min(5, 'Minimum is 5 minutes')
        .max(30, 'Maximum is 30 minutes'),
    auto_start: z.boolean(),
    sync_with_time_tracking: z.boolean(),
    default_project: z.number().nullable().optional(),
    notification_sound: z.boolean(),
});

export type PomodoroSettingsValues = z.infer<typeof PomodoroSettingsSchema>;
