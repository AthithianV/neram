import { Tag } from '@/schema/TagSchema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
export const useTag = () => {
    return useQuery({
        queryKey: ['tags'],
        queryFn: async () => {
            const tags = await invoke('get_all_tags');
            return tags as Tag[];
        },
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchInterval: false,
    });
};

export const useCreateTag = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newTag: {
            title: string;
            description?: string;
            color: string;
            is_default: boolean;
        }) => {
            try {
                return await invoke('create_tag', { newTag });
            } catch (e) {
                console.log(e);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
        },
    });
};

export const useUpdateTag = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { tagId: number; tagToUpdate: Tag }) => {
            return await invoke('update_tag', data);
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
