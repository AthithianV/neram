import { Project } from '@/schema/ProjectSchema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import { toast } from 'sonner';

export interface MinimalProject {
    id: number;
    title: string;
    color: string;
}

export interface ReadProject extends Project {
    id: number;
}

export const useProject = () => {
    return useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const data = await invoke('get_all_projects');
            return data as MinimalProject[];
        },
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchInterval: false,
    });
};

export const useProjectById = (projectId?: number | null) => {
    return useQuery({
        queryKey: ['project', projectId],
        queryFn: async () => {
            if (!projectId) {
                return null;
            }
            const data = await invoke('get_project_by_id', { projectId });
            return data as ReadProject | null;
        },
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchInterval: false,
    });
};

export const useCreateProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (project: Project) => {
            return await invoke('create_project', { newProject: project });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success('New Project Created');
        },
    });
};

export const useUpdateProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { projectToUpdate: Project; projectId: number }) => {
            return await invoke('update_project', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success('Project updated Successfully');
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
            toast.success('Project is Deleted');
        },
    });
};
