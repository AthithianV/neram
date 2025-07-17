import dayjs from 'dayjs';
import { COLORS } from './colors';

export const TASK_INTIAL_VALUE = {
    color: COLORS[0].value,
    status: 'Planning',
    priority: 'Low',
    title: 'Untitled',
    started_at: dayjs().startOf('day').toString(),
    estimated_time: 0,
};

export const TASK_STATUS: TaskStatus[] = [
    'Todo',
    'In Progress',
    'Waiting',
    'Completed',
    'Cancelled',
];

export type TaskStatus =
    | 'Todo'
    | 'In Progress'
    | 'Waiting'
    | 'Completed'
    | 'Cancelled';

export const TASK_STATUS_COLOR = {
    Todo: '#0EA5E9',
    'In Progress': '#FACC15',
    Waiting: '#8B5CF6',
    Completed: '#10B981',
    Cancelled: '#EF4444',
    Default: '#6B7280',
};

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export const TASK_PRIORITY: TaskPriority[] = [
    'Low',
    'Medium',
    'High',
    'Critical',
];

export const TASK_PRIORITY_COLOR = {
    Low: '#059669',
    Medium: '#F59E0B',
    High: '#EF4444',
    Critical: '#E11D48',
    Default: '#991B1B',
};
