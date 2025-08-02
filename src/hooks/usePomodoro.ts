import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';

export interface ReadPomodoroSettings {
    session_duration: number;
    session_count: number;
    break_duration: number;
    auto_start: boolean;
    sync_with_time_tracking: boolean;
    session_completed: number;
    break_completed: number;
}

export type UpdatePomodoroSettings = Partial<ReadPomodoroSettings>;

export const usePomodoroSettings = () => {
    return useQuery({
        queryKey: ['pomodoro_settings'],
        queryFn: async () => {
            try {
                const settings = await invoke('get_pomodoro_settings');
                return settings as ReadPomodoroSettings;
            } catch (err) {
                console.log(err);
            }
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
            try {
                return await invoke('update_pomodoro_settings', { settingsToUpdate });
            } catch (err) {
                console.log(err);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
        },
    });
};
