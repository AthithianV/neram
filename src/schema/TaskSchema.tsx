import { z } from "zod";

const TaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  color: z.string().optional(),
});

export default TaskSchema;
