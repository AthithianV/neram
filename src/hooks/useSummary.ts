import { useQuery } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';

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

export interface DailySummary {
    date: string;
    session_count: number;
    total_duration_sec: number;
    completed_task_count: number;
}

export interface MonthlySummary {
    total_days_worked: number;
    avg_duration_per_day: number;
    total_duration_sec: number;
    session_count: number;
}

type CalendarView = { days: (DailySummary | null)[] };

export interface MonthlyReport {
    calendar_view: CalendarView[];
    monthly_summary: MonthlySummary;
}

// 🔹 Hook: Get summary for a specific day
export const useDaySummary = (date: string) => {
    return useQuery({
        queryKey: ['daySummary', date],
        queryFn: async () => {
            try {
                const data = await invoke('get_day_summary', { date });
                return data as DailySummary;
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
            try {
                const data = await invoke('get_streaks');
                return data as Streak;
            } catch (err) {
                console.log(err);
            }
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
            try {
                const data = await invoke('get_monthly_summary', { year, month });
                return data as MonthlyReport;
            } catch (err) {
                console.log(err);
            }
        },
        enabled: year > 0 && month > 0,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
    });
};
