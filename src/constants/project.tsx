export const PROJECT_INITIAL_VALUES = {
    color: '#3b82f6',
    status: 'active',
    is_billable: false,
    billing_type: 'hourly',
    hourly_rate: 0,
    fixed_rate: 0,
    currency: 'INR',
    tags: [],
};

export const TASK_STATUS = ['Planning', 'In Progress', 'Review', 'Completed'];

export const TASK_STATUS_COLOR = {
    Planning: '#0EA5E9',
    'In Progress': '#FACC15',
    Review: '#EF4444',
    Completed: '#10B981',
};

export const TASK_PRIORITY_COLOR = {
    Low: '#059669',
    Medium: '#F59E0B',
    High: '#EF4444',
    Default: '#6B7280',
};
