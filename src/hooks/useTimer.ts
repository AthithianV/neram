import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import { toast } from 'sonner';

export const useTimer = () => {
    return useQuery({
        queryKey: ['timer'],
        queryFn: async () => {
            const [time, timerType, isRunning] = (await invoke(
                'get_elapsed_time'
            )) as [number, 'session' | 'break' | 'pomodaro', boolean];
            return { time, timerType, isRunning };
        },
        refetchInterval: 1000,
    });
};

export const useStartTimer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (timerType: 'session' | 'break' | 'pomodaro') =>
            invoke('start_timer', { timerType }),
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
