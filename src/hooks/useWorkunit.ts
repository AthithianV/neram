import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import { Workunit } from '@/schema/WorkunitSchema';
import { Tag } from '@/schema/TagSchema';
import { Task } from '@/schema/TaskSchema';
import { toast } from 'sonner';

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
            const workunit = await invoke('get_workunit_by_id', {
                id: parseInt(id, 10),
            });
            return workunit as WorkunitType;
        },
    });
};

export const useCreateWorkunit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (workunit: Workunit) => {
            console.log(workunit);
            await invoke('create_workunit', {
                tags: workunit.tags.map((tag) => tag.title),
                workunit,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workunits'] });
            toast.success('Workunit created successfully');
        },
        onError: (err) => {
            console.log(err);
            toast.error('Failed to create workunit');
        },
    });
};
