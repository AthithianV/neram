import { z } from 'zod';

const TaskSchema = z.object({
    title: z.string(),
    description: z.string().optional().nullable(),
    status: z.string().default('Planning'),
    project_id: z.number(),
    priority: z.string().default('Low'),
    deadline: z.string().optional().nullable(),
    started_at: z.string(),
    completed_at: z.string().optional().nullable(),
    estimated_time: z.number().optional().nullable(),
});

export type Task = z.infer<typeof TaskSchema>;

export default TaskSchema;
