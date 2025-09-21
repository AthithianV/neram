import { useMutation } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import { appDataDir } from '@tauri-apps/api/path';
import { toast } from 'sonner';

import { error } from '@tauri-apps/plugin-log';

export const useLocalBackup = () => {
    return useMutation({
        mutationFn: async () => {
            const appDataPath = await appDataDir();
            return await invoke('backup_db', { path: appDataPath });
        },
        onSuccess: () => {
            toast.success('Back up Completed!');
        },
        onError: (err) => {
            error(`${err.message}, ${JSON.stringify(err.stack)}`);
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
        onError: (err) => {
            toast.error('Invalid File');
            error(`${err.message}, ${JSON.stringify(err.stack)}`);
        },
    });
};

export const useResetData = () => {
    return useMutation({
        mutationFn: async () => {
            const appDataPath = await appDataDir();
            return await invoke('reset_db', { path: appDataPath });
        },
        onSuccess: () => {
            toast.success('Reset Completed!');
        },
        onError: (err) => {
            toast.error('Something Went Wrong');
            error(`${err.message}, ${JSON.stringify(err.stack)}`);
        },
    });
};
