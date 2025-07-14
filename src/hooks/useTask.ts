import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';

export interface Task {
    id: number;
    title: string;
    description?: string;
    color: string;
    project_id: number;
    status: string;
    priority?: string;
    deadline?: string;
    started_at: string;
    completed_at?: string;
    estimated_time: number;
    created_at: string;
    updated_at: string;
}

export const useTask = (projectId: number) => {
    return useQuery({
        queryKey: ['tasks', projectId],
        queryFn: async () => {
            const data = await invoke('get_all_tasks', {
                projectId,
            });
            return data as Task[];
        },
        enabled: projectId !== 0,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchInterval: false,
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
