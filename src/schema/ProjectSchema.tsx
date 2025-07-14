import { z } from 'zod';

const ProjectSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    color: z.string().optional(),
    client_name: z.string().optional(),
    status: z.string(),
    started_at: z.string().optional(),
    deadline: z.string().optional(),
    completed_at: z.string().optional(),
    is_billable: z.boolean().optional(),
    billing_type: z.string().optional(),
    hourly_rate: z.number().optional(),
    fixed_rate: z.number().optional(),
    currency: z.string().optional(),
    tags: z.array(z.number()),
});

export type Project = z.infer<typeof ProjectSchema>;

export default ProjectSchema;
