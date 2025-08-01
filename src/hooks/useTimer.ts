import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import { toast } from 'sonner';

export type TimerResponse = {
    session_time_elapsed: number;
    break_time_elapsed: number;
    session_id?: number;
    is_session: boolean;
    is_break: boolean;
};

export const useTimer = () => {
    return useQuery({
        queryKey: ['timer'],
        queryFn: async () => {
            const data = await invoke<TimerResponse>('get_elapsed_time');
            return data;
        },
        refetchInterval: 1000,
    });
};

export const useStartTimer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { sessionId?: number }) =>
            invoke('start_timer', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timer'] });
        },
        onError: (error) => {
            toast.error(error.toString());
        },
    });
};

export const usePauseTimer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => invoke('pause_timer'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timer'] });
        },
        onError: (error) => {
            toast.error(error.toString());
        },
    });
};

export const useResumeTimer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => invoke('resume_timer'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timer'] });
        },
        onError: (error) => {
            toast.error(error.toString());
        },
    });
};

export const useStopTimer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => invoke('stop_timer'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timer'] });
        },
        onError: (error) => {
            toast.error(error.toString());
        },
    });
};
