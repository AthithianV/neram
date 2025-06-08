import { useQuery } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import { TaskType } from '@/hooks/useWorkunit';

export const useTask = () => {
    return useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const data = await invoke('get_all_tasks');
            return data as TaskType[];
        },
    });
};
