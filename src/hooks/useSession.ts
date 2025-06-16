import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import { Session } from '@/schema/SessionSchema';
import { Tag } from '@/schema/TagSchema';
import { Task } from '@/schema/TaskSchema';
import { toast } from 'sonner';

type DateType = {
    created_at: string;
    updated_at: string;
};

export type SessionType = Session & DateType;
export type TaskType = Task & DateType;
export type TagType = Tag & DateType;

export type SessionWithTaskAndTag = {
    session: SessionType;
    task: TaskType;
    tags: TagType[];
};

export const useSession = () => {
    return useQuery({
        queryKey: ['sessions'],
        queryFn: async () => {
            const sessions = await invoke('get_all_sessions');
            return sessions as SessionWithTaskAndTag[];
        },
    });
};

export const useSessionById = (id: string) => {
    return useQuery({
        queryKey: ['session', id],
        queryFn: async () => {
            const sessionWithTags = await invoke('get_session_by_id', {
                id: parseInt(id, 10),
            });
            return {
                session: (sessionWithTags as any)[0] as SessionType,
                tags: (sessionWithTags as any)[1] as
                    | TagType[]
                    | undefined
                    | null,
            };
        },
    });
};

export const useCreateSession = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newSession: Session) => {
            await invoke('create_session', {
                tags: newSession.tags.map((tag) => tag.title),
                newSession,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            toast.success('Session created successfully');
        },
        onError: (err) => {
            console.log(err);
            toast.error('Failed to create session');
        },
    });
};

export const useUpdateSession = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (sessionToUpdate: Session) => {
            await invoke('update_session', {
                sessionToUpdate,
                tags: sessionToUpdate.tags.map((tag) => tag.title),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            toast.success('Session updated successfully');
        },
        onError: (err) => {
            console.log(err);
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
        onError: (err) => {
            console.log(err);
            toast.error('Failed to delete session');
        },
    });
};

export const useRemoveTagFromSession = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            sessionId,
            tagTitle,
        }: {
            sessionId: number;
            tagTitle: string;
        }) => {
            await invoke('remove_tag_from_session', {
                sessionId,
                tagTitle,
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
            tagTitle,
        }: {
            sessionId: number;
            tagTitle: string;
        }) => {
            await invoke('add_tag_to_session', {
                sessionId,
                tagTitle,
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
