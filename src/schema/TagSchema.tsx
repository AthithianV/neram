import { z } from 'zod';

const TagSchema = z.object({
    id: z.number().optional(),
    title: z.string(),
    description: z.string().optional(),
    color: z.string(),
});

export type Tag = z.infer<typeof TagSchema>;

export default TagSchema;
