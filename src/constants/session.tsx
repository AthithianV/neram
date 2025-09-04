import { CreateSession } from '@/schema/SessionSchema';
import dayjs from 'dayjs';

export const DB_DATE_FORMAT = 'YYYY-MM-DD';
export const DB_TIME_FORMAT = 'HH:mm:ss';
export const DB_DATE_TIME = 'YYYY-MM-DDTHH:mm:ss';
export const TIME_FORMAT = 'hh:mm a';
export const DATE_FORMAT = 'DD/MM/YYYY';

export const DEFAULT_SESSION_VALUES: CreateSession = {
    title: 'Untitled',
    description: '',
    project_id: 1,
    date: dayjs().startOf('day').format(DB_DATE_FORMAT),
    start_time: dayjs().subtract(1, 'hours').valueOf(),
    end_time: dayjs().valueOf(),
    session_duration_sec: 60 * 60,
    break_duration_sec: 0,
    tags: [],
};
