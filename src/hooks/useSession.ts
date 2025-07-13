import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import { CreateSession, Session } from '@/schema/SessionSchema';
import { toast } from 'sonner';

type Related = {
    id: number;
    title: string;
    color: string;
};

export type SessionType = Omit<Session, 'project_id' | 'task_id' | 'tags'> & {
    task: Related;
    project: Related;
    tags: Related[];
};

export type UpdateSessionType = {
    title?: string;
    description?: string;
    task_id?: number;
    project_id?: number;
    date?: string;
    start_time?: string;
    end_time?: string;
    session_duration_sec?: number;
    break_duration_sec?: number;
};

export const useSession = () => {
    return useQuery({
        queryKey: ['sessions'],
        queryFn: async () => {
            const sessions = await invoke('get_all_sessions');
            return sessions as SessionType[];
        },
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchInterval: false,
    });
};

export const useSessionById = (id: string) => {
    return useQuery({
        queryKey: ['session', id],
        queryFn: async () => {
            const sessionWithTags = await invoke('get_session_by_id', {
                id: parseInt(id, 10),
            });
            return sessionWithTags as SessionType;
        },
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchInterval: false,
    });
};

export const useCreateSession = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newSession: CreateSession) => {
            const id = await invoke('create_session', { newSession });
            return id as number;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            toast.success('Session created successfully');
        },
        onError: (err) => {
            console.error(err);
            toast.error('Failed to create session');
        },
    });
};

export const useUpdateSession = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: {
            sessionToUpdate: UpdateSessionType;
            sessionId: number;
        }) => {
            await invoke('update_session', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            toast.success('Session updated successfully');
        },
        onError: () => {
            toast.error('Failed to update session');
        },
    });
};

export const useDeleteSession = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await invoke('delete_session', { id });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            toast.success('Session deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete session');
        },
    });
};

export const useRemoveTagFromSession = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            sessionId,
            tagId,
        }: {
            sessionId: number;
            tagId: number;
        }) => {
            await invoke('remove_tag_from_session', {
                sessionId,
                tagId,
            });
            queryClient.invalidateQueries({
                queryKey: ['session', sessionId.toString()],
            });
            queryClient.invalidateQueries({
                queryKey: ['sessions'],
            });
        },
    });
};

export const useAddTagToSession = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            sessionId,
            tagId,
        }: {
            sessionId: number;
            tagId: number;
        }) => {
            await invoke('add_tag_to_session', {
                sessionId,
                tagId,
            });
            queryClient.invalidateQueries({
                queryKey: ['session', sessionId.toString()],
            });
            queryClient.invalidateQueries({
                queryKey: ['sessions'],
            });
        },
    });
};
