import { Session } from '@/schema/SessionSchema';
import dayjs from 'dayjs';

export const DB_DATE_FORMAT = 'YYYY-MM-DD';
export const DB_TIME_FORMAT = 'HH:mm:ss';
export const TIME_FORMAT = 'hh:mm a';
export const DATE_FORMAT = 'DD/MM/YYYY';

export const DEFAULT_SESSION_VALUES: Session = {
    id: 0,
    title: '',
    description: '',
    task_id: 0,
    project_id: 1,
    date: dayjs().format(`${DB_DATE_FORMAT} ${DB_TIME_FORMAT}`),
    start_time: dayjs(new Date())
        .subtract(1, 'hours')
        .format(`${DB_DATE_FORMAT} ${DB_TIME_FORMAT}`),
    end_time: dayjs().format(`${DB_DATE_FORMAT} ${DB_TIME_FORMAT}`),
    session_duration_sec: 60 * 60,
    break_duration_sec: 0,
    tags: [],
};
