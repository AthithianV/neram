import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import { TagType, TaskType } from '@/hooks/useSession';

export const useTask = () => {
    return useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const data = await invoke('get_all_tasks');
            return data as TaskType[];
        },
    });
};

export const useTag = () => {
    return useQuery({
        queryKey: ['tags'],
        queryFn: async () => {
            const tags = await invoke('get_all_tags');
            return tags as TagType[];
        },
    });
};

export const useCreateTag = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (tag: {
            title: string;
            description?: string;
            color: string;
            is_default: boolean;
        }) => {
            return await invoke('create_tag', tag);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
        },
    });
};

export const useUpdateTag = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (tag: {
            title: string;
            description?: string;
            color: string;
            is_default: boolean;
        }) => {
            return await invoke('update_tag', tag);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
        },
    });
};

export const useDeleteTag = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (title: string) => {
            return await invoke('delete_tag', { title });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
        },
    });
};

export const useAddTagToWorkunit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            workunit_id,
            tag_title,
        }: {
            workunit_id: number;
            tag_title: string;
        }) => {
            return await invoke('add_tag_to_workunit', {
                workunit_id,
                tag_title,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workunits'] });
        },
    });
};

export const useRemoveTagFromWorkunit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            workunit_id,
            tag_title,
        }: {
            workunit_id: number;
            tag_title: string;
        }) => {
            return await invoke('remove_tag_from_workunit', {
                workunit_id,
                tag_title,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workunits'] });
        },
    });
};
