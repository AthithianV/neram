import { create } from "zustand";
import { Workunit } from "@/schema/WorkunitSchema";
import dayjs from "dayjs";

interface WorkunitStore {
  workunits: Workunit[];
  addWorkunit: (workunit: Workunit) => void;
  removeWorkunit: (workunit: Workunit) => void;
  updateWorkunit: (workunit: Workunit) => void;
}

const useWorkunitStore = create<WorkunitStore>((set) => ({
  workunits: [
    {
      id: "1",
      title: "Work",
      description: "Work",
      task: "Work",
      tags: ["Work"],
      startTime: dayjs().toDate(),
      endTime: dayjs().add(1, "hour").toDate(),
      date: dayjs().toDate(),
      duration: 100,
      break: 10,
    },
    {
      id: "2",
      title: "Work",
      description: "Work",
      task: "Work",
      tags: ["Work"],
      startTime: dayjs().toDate(),
      endTime: dayjs().add(1, "hour").toDate(),
      date: dayjs().toDate(),
      duration: 100,
      break: 10,
    },
  ],
  addWorkunit: (workunit) =>
    set((state) => ({ workunits: [...state.workunits, workunit] })),
  removeWorkunit: (workunit) =>
    set((state) => ({
      workunits: state.workunits.filter((w) => w.id !== workunit.id),
    })),
  updateWorkunit: (workunit) =>
    set((state) => ({
      workunits: state.workunits.map((w) =>
        w.id === workunit.id ? workunit : w
      ),
    })),
}));

export default useWorkunitStore;
