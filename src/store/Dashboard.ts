import { create } from "zustand";
import { z } from "zod";
import WorkunitSchema from "@/schema/WorkunitSchema";

type Workunit = z.infer<typeof WorkunitSchema>;

interface WorkUnitStore {
  workunits: Workunit[];
}

const useWorkUnitStore = create<WorkUnitStore>((set) => ({
  workunits: [],
}));

export default useWorkUnitStore;
