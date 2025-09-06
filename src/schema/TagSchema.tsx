import { z } from 'zod';

const BaseTagSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    color: z.string(),
});

// Tag (with id required)
export const TagSchema = BaseTagSchema.extend({
    id: z.number(),
});

// CreateTag (id optional)
export const CreateTagSchema = BaseTagSchema.extend({
    id: z.number().optional(),
});

export type Tag = z.infer<typeof TagSchema>;
export type CreateTag = z.infer<typeof CreateTagSchema>;
