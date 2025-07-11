import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import { toast } from 'sonner';

type TimerType = 'Session' | 'Break' | 'Pomodaro';

type TimerResponse = {
    time: number;
    timer_type: TimerType;
    is_running: boolean;
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
        mutationFn: (data: { timerType: TimerType; sessionId?: number }) =>
            invoke('start_timer', data),
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
