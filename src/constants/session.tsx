import { Session } from '@/schema/SessionSchema';
import dayjs from 'dayjs';

export const DEFAULT_SESSION_VALUES: Session = {
    id: 0,
    title: '',
    description: '',
    task_id: 0,
    project_id: 1,
    date: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
    start_time: dayjs(new Date())
        .subtract(1, 'hour')
        .format('YYYY-MM-DDTHH:mm:ss'),
    end_time: dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
    session_duration_sec: 60 * 60,
    break_duration_sec: 0,
    tags: [],
};
