import { Workunit } from '@/schema/WorkunitSchema';
import dayjs from 'dayjs';
import { create } from 'zustand';
import { z } from 'zod';
import TagSchema from '@/schema/TagSchema';
import TaskSchema from '@/schema/TaskSchema';

type Tag = z.infer<typeof TagSchema>;
type Task = z.infer<typeof TaskSchema>;

interface WorkunitStore {
    workunits: Workunit[];
    tags: Tag[];
    tasks: Task[];
    addWorkunit: (workunit: Workunit) => void;
    removeWorkunit: (workunit: Workunit) => void;
    updateWorkunit: (workunit: Workunit) => void;
    addTag: (tag: Tag) => void;
    removeTag: (tag: Tag) => void;
    addTask: (task: Task) => void;
    removeTask: (task: Task) => void;
    setTimer: (duration: number, workunitId: number) => void;
}

const useWorkunitStore = create<WorkunitStore>((set) => ({
    workunits: [
        {
            id: 1,
            title: 'Work',
            description: 'Work',
            task: 'Work',
            tags: ['Work'],
            startTime: dayjs().toDate(),
            endTime: dayjs().add(1, 'hour').toDate(),
            date: dayjs().toDate(),
            duration: 100,
            break: 10,
        },
        {
            id: 2,
            title: 'Work',
            description: 'Work',
            task: 'Work',
            tags: ['Work'],
            startTime: dayjs().toDate(),
            endTime: dayjs().add(1, 'hour').toDate(),
            date: dayjs().toDate(),
            duration: 100,
            break: 10,
        },
    ],
    tags: [],
    tasks: [],
    addWorkunit: (workunit) =>
        set((state) => ({ workunits: [workunit, ...state.workunits] })),
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
    addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
    removeTag: (tag) =>
        set((state) => ({ tags: state.tags.filter((t) => t.id !== tag.id) })),
    addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
    removeTask: (task) =>
        set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== task.id),
        })),
    setTimer: (duration: number, workunitId: number) =>
        set((state) => ({
            workunits: state.workunits.map((w) =>
                w.id === workunitId
                    ? { ...w, duration: w.duration + duration }
                    : w
            ),
        })),
}));

export default useWorkunitStore;
