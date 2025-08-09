export const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY';
export const DEFAULT_TIME_FORMAT = 'hh:mm:ss A';
export const DEFAULT_TIME_ZONE = 'Asia/Kolkata';

export const DATE_FORMAT_OPTIONS = [
    { value: 'DD-MM-YYYY', label: '23-12-2025' },
    { value: 'MM-DD-YYYY', label: '12-23-2025' },
    { value: 'YYYY-MM-DD', label: '2025-12-23' },
    { value: 'DD/MM/YYYY', label: '23/12/2025' },
    { value: 'MM/DD/YYYY', label: '12/23/2025' },
    { value: 'YYYY/MM/DD', label: '2025/12/23' },
    { value: 'DD MMM YYYY', label: '23 Dec 2025' },
    { value: 'DD MMMM YYYY', label: '23 December 2025' },
];

export const TIME_FORMAT_OPTIONS = [
    { label: '01:59:12 PM', value: 'hh:mm:ss A' },
    { label: '01:59:12 pm', value: 'hh:mm:ss a' },
    { label: '01:59 PM', value: 'hh:mm A' },
    { label: '01:59 pm', value: 'hh:mm a' },
    { label: '13:59:12', value: 'HH:mm:ss' },
    { label: '13:59', value: 'HH:mm' },
];

export const TIME_ZONE_OPTIONS = [{ label: 'UTC', value: 'UTC' }];
