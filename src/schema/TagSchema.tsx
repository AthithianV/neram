import { z } from 'zod';

const TagSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    color: z.string(),
    is_default: z.boolean(),
});

export type Tag = z.infer<typeof TagSchema>;

export default TagSchema;
