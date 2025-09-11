import { useMutation } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import { appDataDir } from '@tauri-apps/api/path';
import { toast } from 'sonner';

export const useLocalBackup = () => {
    return useMutation({
        mutationFn: async () => {
            const appDataPath = await appDataDir();
            return await invoke('backup_db', { path: appDataPath });
        },
        onSuccess: () => {
            toast.success('Back up Completed!');
        },
    });
};

export const useRestoreData = () => {
    return useMutation({
        mutationFn: async () => {
            const appDataPath = await appDataDir();
            return await invoke('restore_db', { path: appDataPath });
        },
        onSuccess: () => {
            toast.success('Restored Completed!');
        },
        onError: () => {
            toast.error('Invalid File');
        },
    });
};
