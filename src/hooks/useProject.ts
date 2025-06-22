import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import { Project } from '@/schema/ProjectSchema';

export const useProject = () => {
    return useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const data = await invoke('get_all_projects');
            return data as Project[];
        },
    });
};

export const useCreateProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (project: {
            title: string;
            description?: string;
            color?: string;
            client_name?: string;
            status: string;
            started_at?: string;
            deadline?: string;
            completed_at?: string;
            is_billable?: boolean;
            billing_type?: string;
            hourly_rate?: number;
            fixed_rate?: number;
            currency?: string;
        }) => {
            return await invoke('create_project', project);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });
};

export const useUpdateProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (project: {
            id: number;
            title: string;
            description?: string;
            color?: string;
            client_name?: string;
            status: string;
            started_at?: string;
            deadline?: string;
            completed_at?: string;
            is_billable?: boolean;
            billing_type?: string;
            hourly_rate?: number;
            fixed_rate?: number;
            currency?: string;
        }) => {
            return await invoke('update_project', project);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });
};

export const useDeleteProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            return await invoke('delete_project', { id });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });
};
