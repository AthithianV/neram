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
            const workunitWithTags = await invoke('get_workunit_by_id', {
                id: parseInt(id, 10),
            });
            return {
                workunit: (workunitWithTags as any)[0] as WorkunitType,
                tags: (workunitWithTags as any)[1] as
                    | TagType[]
                    | undefined
                    | null,
            };
        },
    });
};

export const useCreateWorkunit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newWorkunit: Workunit) => {
            console.log(newWorkunit);
            await invoke('create_workunit', {
                tags: newWorkunit.tags.map((tag) => tag.title),
                newWorkunit,
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

export const useUpdateWorkunit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (workunitToUpdate: Workunit) => {
            console.log(workunitToUpdate);
            await invoke('update_workunit', {
                workunitToUpdate,
                tags: workunitToUpdate.tags.map((tag) => tag.title),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workunits'] });
            toast.success('Workunit updated successfully');
        },
        onError: (err) => {
            console.log(err);
            toast.error('Failed to update workunit');
        },
    });
};

export const useDeleteWorkunit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await invoke('delete_workunit', { id });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workunits'] });
            toast.success('Workunit deleted successfully');
        },
        onError: (err) => {
            console.log(err);
            toast.error('Failed to delete workunit');
        },
    });
};

export const useRemoveTagFromWorkunit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            workunitId,
            tagTitle,
        }: {
            workunitId: number;
            tagTitle: string;
        }) => {
            await invoke('remove_tag_from_workunit', {
                workunitId,
                tagTitle,
            });
            queryClient.invalidateQueries({
                queryKey: ['workunit', workunitId.toString()],
            });
            queryClient.invalidateQueries({
                queryKey: ['workunits'],
            });
        },
    });
};

export const useAddTagToWorkunit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            workunitId,
            tagTitle,
        }: {
            workunitId: number;
            tagTitle: string;
        }) => {
            await invoke('add_tag_to_workunit', {
                workunitId,
                tagTitle,
            });
            queryClient.invalidateQueries({
                queryKey: ['workunit', workunitId.toString()],
            });
            queryClient.invalidateQueries({
                queryKey: ['workunits'],
            });
        },
    });
};
