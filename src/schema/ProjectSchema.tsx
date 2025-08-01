import { z } from 'zod';

const ProjectSchema = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    description: z.string().optional(),
    color: z.string(),
    started_at: z.string().optional().nullable(),
    deadline: z.string().optional().nullable(),
    completed_at: z.string().optional().nullable(),

    client_name: z.string().optional().nullable(),
    is_billable: z.boolean().optional().nullable(),
    billing_type: z.enum(['Hourly', 'Fixed']).optional().nullable(),
    hourly_rate: z.number().optional().nullable(),
    fixed_rate: z.number().optional().nullable(),
    currency: z.string().optional().nullable(),
    tags: z.array(z.number()),
});

export type Project = z.infer<typeof ProjectSchema>;

export default ProjectSchema;
