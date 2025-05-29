import { z } from "zod";

const TaskSchema = z.object({
  id: z.number(),
  title: z.string().optional(),
  description: z.string().optional(),
  color: z.string().optional(),
});

export type Task = z.infer<typeof TaskSchema>;

export default TaskSchema;
