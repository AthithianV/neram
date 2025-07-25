import { DB_DATE_TIME, TIME_FORMAT } from '@/constants/session';
import dayjs from 'dayjs';

export const formatDuration = (seconds: number) => {
    return `${Math.floor(seconds / 3600)
        .toString()
        .padStart(2, '0')}:${Math.floor((seconds % 3600) / 60)
        .toString()
        .padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
};

export const calcualteDuration = (time: string) => {
    const [hh, mm, ss] = time.split(':').map((part) => Number(part));
    return hh * 3600 + mm * 60 + ss;
};

export const toDBTime = (date: string | Date, shouldClearTime?: boolean) => {
    let dateFormat = dayjs(date);
    if (shouldClearTime) {
        dateFormat = dateFormat.startOf('day');
    }
    return dateFormat.format(DB_DATE_TIME);
};

export const makeTimeDisplay = (time: string) => {
    return dayjs(time).format(TIME_FORMAT);
};
