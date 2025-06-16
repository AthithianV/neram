import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import { Tag } from '@/schema/TagSchema';

export const useTag = () => {
    return useQuery({
        queryKey: ['tags'],
        queryFn: async () => {
            const tags = await invoke('get_all_tags');
            return tags as Tag[];
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
