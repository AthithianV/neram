import { formatDate } from '@/lib/time';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import { useUpdateSession } from './useSession';

export type TimerResponse = {
    session_time_elapsed: number;
    break_time_elapsed: number;
    session_id?: number;
    task_id?: number;
    is_session: boolean;
    is_break: boolean;
    timer: number;
    timer_type: 'Session' | 'Pomodoro';
};

export type StartTimerData = {
    sessionId?: number;
    taskId?: number;
    timerType?: 'Session' | 'Pomodoro';
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
        mutationFn: (data: StartTimerData) => invoke('start_timer', data),
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
    const { data: timer } = useTimer();
    const { mutateAsync: updateSession } = useUpdateSession();
    return useMutation({
        mutationFn: async () => {
            if (timer) {
                if (timer.session_id) {
                    await updateSession({
                        sessionToUpdate: {
                            session_duration_sec: timer.session_time_elapsed,
                        },
                        sessionId: timer.session_id,
                    });
                }
                await invoke('pause_timer');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timer'] });
        },
        onError: (error) => {
            toast.error(error.toString());
        },
    });
};

export const useResumeTimer = () => {
    const { data: timer } = useTimer();
    const { mutateAsync: updateSession } = useUpdateSession();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            if (timer) {
                if (timer.session_id) {
                    await updateSession({
                        sessionToUpdate: {
                            break_duration_sec: timer.break_time_elapsed,
                        },
                        sessionId: timer.session_id,
                    });
                }
                invoke('resume_timer');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timer'] });
        },
        onError: (error) => {
            toast.error(error.toString());
        },
    });
};

export const useStopTimer = () => {
    const { data: timer } = useTimer();
    const { mutateAsync: updateSession } = useUpdateSession();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            if (timer) {
                if (timer.session_id) {
                    await updateSession({
                        sessionToUpdate: {
                            session_duration_sec: timer.session_time_elapsed,
                            break_duration_sec: timer.break_time_elapsed,
                            end_time: formatDate(dayjs()),
                        },
                        sessionId: timer.session_id,
                    });
                    queryClient.invalidateQueries({ queryKey: ['sessions', 'tasks'] });
                }
                await invoke('stop_timer');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timer'] });
        },
        onError: (error) => {
            toast.error(error.toString());
        },
    });
};
