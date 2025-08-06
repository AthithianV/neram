import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { DB_DATE_FORMAT, TIME_FORMAT } from '@/constants/session';
import { useSettings } from '@/hooks/useSettings';
import { formatDate } from '@/lib/time';
import { useEffect, useState } from 'react';
import { Input } from '../ui/input';

export interface TimeElementProps {
    value: string | undefined;
    date: string;
    setValue: (val: string) => void;
    setError: (error: string) => void;
    isDisable?: boolean;
    adjustDuration?: () => void;
}

const TimeElement = ({
    value,
    setValue,
    setError,
    date,
    isDisable,
    adjustDuration,
}: TimeElementProps) => {
    dayjs.extend(customParseFormat);

    const { data: settings } = useSettings();

    const [time, setTime] = useState<string>(
        value ? formatDate(value, { format: settings?.time_format }) : '',
    );

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTime(e.target.value);
    };

    useEffect(() => {
        setTime(value ? formatDate(value, { format: settings?.time_format }) : '');
    }, [value]);

    const handleTimeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const parsedTime = dayjs(e.target.value, settings?.time_format, true);
        if (!parsedTime.isValid()) {
            setError('Invalid time format');
        } else {
            setError('');

            const setDate =
                dayjs(date).format(DB_DATE_FORMAT) || dayjs().format(DB_DATE_FORMAT);

            const result = dayjs(
                `${setDate} ${e.target.value}`,
                `${DB_DATE_FORMAT} ${TIME_FORMAT}`,
            ).toString();

            setValue(formatDate(result));
        }
        adjustDuration && adjustDuration();
    };

    return (
        <Input
            value={time}
            onChange={handleTimeChange}
            onBlur={handleTimeValue}
            className="input"
            disabled={isDisable}
        />
    );
};

export default TimeElement;
