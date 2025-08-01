import { useQuery } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import { MinimalProject } from './useProject';

export type StatisticsFilter = {
    start_date: string;
    end_date: string;
    project_ids?: number[];
    tag_ids?: number[];
};

export type Statistics = {
    date: string;
    projects: {
        project: MinimalProject;
        total_seconds: number;
    }[];
    total_seconds: number;
};

export const useStatistics = (filter: StatisticsFilter) => {
    return useQuery({
        queryKey: ['statistics', filter],
        queryFn: async () => {
            try {
                const result = await invoke('get_statistics', {
                    statisticsFilter: filter,
                });
                return result as Statistics[];
            } catch (err) {
                console.log(err);
            }
        },
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchInterval: false,
    });
};
