import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { Input } from '../ui/input';
import { useEffect, useState } from 'react';
import { toDBTime } from '@/lib/time';
import { DB_DATE_FORMAT, TIME_FORMAT } from '@/constants/session';

export interface TimeElementProps {
    value: string | undefined;
    date: string;
    setValue: (val: string) => void;
    setError: (error: string) => void;
    isDisable?: boolean;
}

const TimeElement = ({
    value,
    setValue,
    setError,
    date,
    isDisable,
}: TimeElementProps) => {
    dayjs.extend(customParseFormat);

    const [time, setTime] = useState<string>(
        value ? dayjs(value).format(TIME_FORMAT) : '',
    );

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTime(e.target.value);
    };

    useEffect(() => {
        setTime(value ? dayjs(value).format(TIME_FORMAT) : '');
    }, [value]);

    const handleTimeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const parsedTime = dayjs(e.target.value, TIME_FORMAT, true);
        if (!parsedTime.isValid()) {
            setError('Invalid time format');
        } else {
            setError('');

            const setDate =
                dayjs(date).format(DB_DATE_FORMAT) ||
                dayjs().format(DB_DATE_FORMAT);

            const result = dayjs(
                `${setDate} ${e.target.value}`,
                `${DB_DATE_FORMAT} ${TIME_FORMAT}`,
            ).toString();

            setValue(toDBTime(result));
        }
    };

    return (
        <Input
            value={time}
            onChange={handleTimeChange}
            onBlur={handleTimeValue}
            className="text-center bg-white"
            disabled={isDisable}
        />
    );
};

export default TimeElement;
