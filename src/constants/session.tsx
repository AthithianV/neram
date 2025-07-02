import { Session } from '@/schema/SessionSchema';
import dayjs from 'dayjs';

export const DEFAULT_SESSION_VALUES: Session = {
    id: 0,
    title: '',
    description: '',
    task_id: 0,
    project_id: 1,
    date: new Date(),
    start_time: dayjs(new Date()).subtract(1, 'hour').toDate(),
    end_time: dayjs(new Date()).toDate(),
    session_duration_sec: 60 * 60,
    break_duration_sec: 0,
    tags: [],
};
