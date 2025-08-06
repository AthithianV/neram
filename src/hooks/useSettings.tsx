import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import { toast } from 'sonner';

export interface ReadSettings {
    theme: 'Light' | 'Dark' | 'System';
    date_format: string;
    time_format: string;
}

export type UpdateSettings = Partial<ReadSettings>;

export const useSettings = () => {
    return useQuery({
        queryKey: ['settings'],
        queryFn: async () => {
            try {
                const sessions = await invoke('get_settings');
                return sessions as ReadSettings;
            } catch (err) {
                console.log(err);
            }
        },
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchInterval: false,
    });
};

export const useUpdateSettings = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { settingsToUpdate: UpdateSettings }) => {
            await invoke('update_settings', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings'] });
        },
        onError: () => {
            toast.error('Failed to update session');
        },
    });
};
