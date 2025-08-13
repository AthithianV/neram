import { Task } from '@/schema/TaskSchema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import { toast } from 'sonner';

export interface ReadTask extends Task {
    id: number;
    total_duration_sec?: number;
    created_at: string;
    updated_at: string;
}

export const useTask = (projectId: number) => {
    return useQuery({
        queryKey: ['tasks', projectId],
        queryFn: async () => {
            try {
                const data = await invoke('get_all_tasks', {
                    projectId,
                });
                return data as ReadTask[];
            } catch (err) {
                console.log(err);
            }
        },
        enabled: projectId !== 0,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchInterval: false,
    });
};

export const useTaskById = (taskId?: number | null) => {
    return useQuery({
        queryKey: ['task', taskId],
        queryFn: async () => {
            if (!taskId) {
                return null;
            }
            try {
                const data = await invoke('get_task_by_id', {
                    taskId,
                });
                return data as ReadTask | null;
            } catch (err) {
                console.log(err);
                return null;
            }
        },
        enabled: taskId !== 0,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchInterval: false,
    });
};

export const useCreateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (task: Task) => {
            return await invoke('create_task', { taskToCreate: task });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            toast.success('New Task Created');
        },
    });
};

export const useUpdateTask = (projectId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { taskToUpdate: Task; taskId: number }) => {
            return await invoke('update_task', data);
        },
        onMutate: async ({ taskToUpdate, taskId }) => {
            await queryClient.cancelQueries({ queryKey: ['tasks', projectId] });

            const previousTasks = queryClient.getQueryData<ReadTask[]>([
                'tasks',
                projectId,
            ]);

            queryClient.setQueryData<ReadTask[]>(['tasks', projectId], (old = []) =>
                old.map((task) =>
                    task.id === taskId ? { ...task, ...taskToUpdate } : task,
                ),
            );

            return { previousTasks };
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
        },
        onError: (err, _, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(['tasks'], projectId);
            }
            console.error('Update failed:', err);
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
        mutationFn: async ({ task_id, tag_id }: { task_id: number; tag_id: number }) => {
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
        mutationFn: async ({ task_id, tag_id }: { task_id: number; tag_id: number }) => {
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
