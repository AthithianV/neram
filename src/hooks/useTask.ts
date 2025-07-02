import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';

export interface MiniTask {
    id: number;
    title: string;
    color: string;
}

export const useTask = () => {
    return useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const data = await invoke('get_all_tasks');
            return data as MiniTask[];
        },
    });
};

export const useCreateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (task: {
            title: string;
            description?: string;
            color: string;
            status: string;
            project_id: number;
            priority: string;
            deadline?: string;
            started_at: string;
            completed_at?: string;
            estimated_time?: number;
        }) => {
            return await invoke('create_task', task);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};

export const useUpdateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (task: {
            title: string;
            description?: string;
            color: string;
            status: string;
            project_id: number;
            priority: string;
            deadline?: string;
            started_at: string;
            completed_at?: string;
            estimated_time?: number;
        }) => {
            return await invoke('update_task', task);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            return await invoke('delete_task', { id });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};

export const useAddTagToTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            task_id,
            tag_id,
        }: {
            task_id: number;
            tag_id: number;
        }) => {
            return await invoke('add_tag_to_task', {
                task_id,
                tag_id,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};

export const useRemoveTagFromTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            task_id,
            tag_id,
        }: {
            task_id: number;
            tag_id: number;
        }) => {
            return await invoke('remove_tag_from_task', {
                task_id,
                tag_id,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};
