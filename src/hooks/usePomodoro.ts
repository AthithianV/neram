import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';

export interface ReadPomodoroSettings {
    session_duration: number;
    session_count: number;
    break_duration: number;
    auto_start: boolean;
    sync_with_time_tracking: boolean;
}

export type UpdatePomodoroSettings = Partial<ReadPomodoroSettings>;

export const usePomodoroSettings = () => {
    return useQuery({
        queryKey: ['pomodoro_settings'],
        queryFn: async () => {
            const settings = await invoke('get_pomodoro_settings');
            return settings as ReadPomodoroSettings;
        },
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchInterval: false,
    });
};

export const useUpdatePomodoroSettings = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (settingsToUpdate: UpdatePomodoroSettings) => {
            return await invoke('update_pomodoro_settings', { settingsToUpdate });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
        },
    });
};
