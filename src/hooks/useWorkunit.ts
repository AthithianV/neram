import { useQuery } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import { Workunit } from '@/schema/WorkunitSchema';
import { Tag } from '@/schema/TagSchema';
import { Task } from '@/schema/TaskSchema';

type DateTypes = {
    created_at: string;
    updated_at: string;
};

type WorkunitType = Workunit & DateTypes;
type TaskType = Task & DateTypes;
type TagType = Tag & DateTypes;

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
            const workunitsWithTaskAndTags = (workunits as any[]).map(
                (workunitWithTaskAndTag: any) => {
                    const [workunit, task, tags] = workunitWithTaskAndTag;
                    return {
                        workunit,
                        task,
                        tags,
                    };
                }
            );
            return workunitsWithTaskAndTags as WorkunitWithTaskAndTag[];
        },
    });
};
