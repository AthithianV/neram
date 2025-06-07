import { useQuery } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import { Workunit } from '@/schema/WorkunitSchema';

export const useWorkunit = () => {
    return useQuery({
        queryKey: ['workunits'],
        queryFn: async () => {
            const workunits = await invoke('get_all_workunits');
            return workunits as Workunit[];
        },
    });
};
