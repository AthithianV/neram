import { z } from "zod";

const TagSchema = z.object({
  id: z.number(),
  title: z.string().optional(),
  description: z.string().optional(),
  color: z.string().optional(),
});

export type Tag = z.infer<typeof TagSchema>;

export default TagSchema;
