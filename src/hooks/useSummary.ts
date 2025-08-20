import { useQuery } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';

export interface DaySummary {
    count: number;
    total_duration_sec: number;
}

export interface Streak {
    current_streak: number;
    total_streak: number;
}

export interface LifeTimeSummary {
    duration_sec: number;
    session_count: number;
    focused_day_count: number;
    completed_task_count: number;
    project_count: number;
}

export interface MonthlySummary {
    date: number; // YYYYMMDD (e.g. 20250819)
    session_count: number;
    total_duration_sec: number;
    completed_task_count: number;
}

type CalendarWeek = { days: (MonthlySummary | null)[] };

// 🔹 Hook: Get summary for a specific day
export const useDaySummary = (date: string) => {
    return useQuery({
        queryKey: ['daySummary', date],
        queryFn: async () => {
            try {
                const data = await invoke('get_day_summary', { date });
                return data as DaySummary;
            } catch (err) {
                console.log(err);
            }
        },
        enabled: !!date,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
    });
};

// 🔹 Hook: Get streak info
export const useStreaks = () => {
    return useQuery({
        queryKey: ['streaks'],
        queryFn: async () => {
            const data = await invoke('get_streaks');
            return data as Streak;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: true,
    });
};

// 🔹 Hook: Get lifetime summary
export const useLifeTimeSummary = () => {
    return useQuery({
        queryKey: ['lifeTimeSummary'],
        queryFn: async () => {
            const data = await invoke('get_life_time_summary');
            return data as LifeTimeSummary;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: true,
    });
};

// 🔹 Hook: Get monthly summary for given year + month
export const useMonthlySummary = (year: number, month: number) => {
    return useQuery({
        queryKey: ['monthlySummary', year, month],
        queryFn: async () => {
            const data = await invoke('get_monthly_summary', { year, month });
            return data as CalendarWeek[];
        },
        enabled: year > 0 && month > 0,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
    });
};
