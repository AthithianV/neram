import { z } from 'zod';

const TaskSchema = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string().optional(),
    color: z.string(),
    status: z.string(),
    project_id: z.number(),
    priority: z.string(),
    deadline: z.date().optional(),
    started_at: z.date(),
    completed_at: z.date().optional(),
    estimated_time: z.number().optional(),
});

export type Task = z.infer<typeof TaskSchema>;

export default TaskSchema;
