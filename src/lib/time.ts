import {
    DB_DATE_FORMAT,
    DB_TIME_FORMAT,
    TIME_FORMAT,
} from '@/constants/session';
import dayjs from 'dayjs';

export const formatDuration = (seconds: number) => {
    return `${Math.floor(seconds / 3600)
        .toString()
        .padStart(2, '0')}:${Math.floor((seconds % 3600) / 60)
        .toString()
        .padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
};

export const toDBTime = (time: string) => {
    return dayjs(time).format(`${DB_DATE_FORMAT}T${DB_TIME_FORMAT}`);
};

export const makeTimeDisplay = (time: string) => {
    return dayjs(time).format(TIME_FORMAT);
};
