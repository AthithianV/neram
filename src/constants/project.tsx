import dayjs from 'dayjs';
import { COLORS } from './colors';

export const PROJECT_INITIAL_VALUES = {
    color: COLORS[0].value,
    status: 'active',
    is_billable: false,
    billing_type: 'hourly',
    hourly_rate: 0,
    fixed_rate: 0,
    currency: 'INR',
    tags: [],
};

export const TASK_INTIAL_VALUE = {
    color: COLORS[0].value,
    status: 'Planning',
    priority: 'Low',
    title: 'Untitled',
    started_at: dayjs().startOf('day').toString(),
    estimated_time: 0,
};

export const TASK_STATUS = ['Planning', 'In Progress', 'Review', 'Completed'];

export type TaskStatus = 'Planning' | 'In Progress' | 'Review' | 'Completed';

export const TASK_STATUS_COLOR = {
    Planning: '#0EA5E9',
    'In Progress': '#FACC15',
    Review: '#EF4444',
    Completed: '#10B981',
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
