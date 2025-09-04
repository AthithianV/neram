import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { useSettings } from '@/hooks/useSettings';
import { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';

export interface TimeElementProps {
    value: number | undefined;
    setValue: (val: number) => void;
    setError: (error: string) => void;
    isDisable?: boolean;
    adjustDuration?: () => void;
    date: string;
}

const TimeElement = ({
    value,
    setValue,
    setError,
    isDisable,
    adjustDuration,
    date,
}: TimeElementProps) => {
    dayjs.extend(customParseFormat);

    const { data: settings } = useSettings();

    const [time, setTime] = useState<string>(
        dayjs(value).format(settings?.time_format) ?? '',
    );

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTime(e.target.value);
    };

    useEffect(() => {
        setTime(dayjs(value).format(settings?.time_format) ?? '');
    }, [value]);

    if (!settings) {
        return <Skeleton />;
    }

    const handleTimeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const parsedTime = dayjs(e.target.value, settings.time_format, true);
        if (!parsedTime.isValid()) {
            setError('Invalid time format');
        } else {
            setError('');
            const pickedDate = dayjs(date);
            const d = pickedDate.get('date');
            const m = pickedDate.get('month');
            const y = pickedDate.get('year');
            parsedTime
                .set('month', m)
                .set('date', d)
                .set('year', y)
                .format('DD MMMM YYYY HH:mm:SS');
            setValue(parsedTime.valueOf());
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
