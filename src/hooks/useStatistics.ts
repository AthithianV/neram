import { useQuery } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import { MinimalProject } from './useProject';

type StatisticsFilter = {
    start_date: string;
    end_date: string;
    project_ids?: number[];
    tag_ids?: number[];
};

type Statistics = {
    date: string;
    projects: {
        project: MinimalProject;
        total_seconds: number;
    }[];
    total_seconds: number;
};

export const useStatistics = (data: StatisticsFilter) => {
    return useQuery({
        queryKey: ['statistics'],
        queryFn: async () => {
            try {
                const result = await invoke('get_statistics', data);
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
