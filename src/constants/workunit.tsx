import { Workunit } from '@/schema/WorkunitSchema';
import dayjs from 'dayjs';

export const DEFAULT_WORKUNIT_VALUES: Workunit = {
    id: 0,
    title: '',
    description: '',
    task: '',
    date: new Date(),
    start_time: dayjs(new Date()).subtract(1, 'hour').toDate(),
    end_time: dayjs(new Date()).toDate(),
    session_duration: 60 * 60,
    break_duration: 0,
    tags: [],
};
