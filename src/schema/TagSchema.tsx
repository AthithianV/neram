import { z } from 'zod';

const TagSchema = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string().optional(),
    color: z.string(),
});

export type Tag = z.infer<typeof TagSchema>;

export default TagSchema;
