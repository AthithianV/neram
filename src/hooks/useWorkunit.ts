import { useQuery } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import { Workunit } from '@/schema/WorkunitSchema';
import { Tag } from '@/schema/TagSchema';
import { Task } from '@/schema/TaskSchema';

type DateType = {
    created_at: string;
    updated_at: string;
};

export type WorkunitType = Workunit & DateType;
export type TaskType = Task & DateType;
export type TagType = Tag & DateType;

export type WorkunitWithTaskAndTag = {
    workunit: WorkunitType;
    task: TaskType;
    tags: TagType[];
};

export const useWorkunit = () => {
    return useQuery({
        queryKey: ['workunits'],
        queryFn: async () => {
            const workunits = await invoke('get_all_workunits');
            return workunits as WorkunitWithTaskAndTag[];
        },
    });
};

export const useWorkunitById = (id: string) => {
    return useQuery({
        queryKey: ['workunit', id],
        queryFn: async () => {
            console.log(id);
            const workunit = await invoke('get_workunit_by_id', { id });
            console.log(workunit);
            return workunit as WorkunitType;
        },
    });
};
