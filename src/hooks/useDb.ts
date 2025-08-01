import { invoke } from '@tauri-apps/api/core';
import { appDataDir } from '@tauri-apps/api/path';
import { useQuery } from '@tanstack/react-query';

export const useDb = () => {
    return useQuery({
        queryKey: ['db'],
        queryFn: async () => {
            const appDataPath = await appDataDir();
            const result = await invoke('init_db', { path: appDataPath });
            return result;
        },
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchInterval: false,
    });
};
