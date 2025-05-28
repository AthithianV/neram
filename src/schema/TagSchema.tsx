import { z } from "zod";

const TagSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  color: z.string().optional(),
});

export default TagSchema;
