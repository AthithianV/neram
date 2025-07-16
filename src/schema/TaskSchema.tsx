import { z } from 'zod';

const TaskSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    color: z.string(),
    status: z.string().default('Planning'),
    project_id: z.number(),
    priority: z.string().default('Low'),
    deadline: z.string().optional(),
    started_at: z.string(),
    completed_at: z.string().optional(),
    estimated_time: z.number().optional(),
});

export type Task = z.infer<typeof TaskSchema>;

export default TaskSchema;
