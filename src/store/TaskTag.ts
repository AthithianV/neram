import { create } from "zustand";
import { z } from "zod";
import TagSchema from "@/schema/TagSchema";
import TaskSchema from "@/schema/TaskSchema";

type Tag = z.infer<typeof TagSchema>;
type Task = z.infer<typeof TaskSchema>;

interface TaskTagStore {
  tags: Tag[];
  tasks: Task[];
}

const useTaskTagStore = create<TaskTagStore>((set) => ({
  tags: [],
  tasks: [],
}));

export default useTaskTagStore;
