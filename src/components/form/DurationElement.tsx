import { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { formatDuration } from '@/lib/time';

const DurationElement = ({
    value,
    setValue,
    setError,
}: {
    value: number;
    setValue: (value: number) => void;
    setError: (error: string) => void;
}) => {
    const [fieldValue, setFieldValue] = useState(formatDuration(value));

    useEffect(() => {
        setFieldValue(formatDuration(value));
    }, [value]);

    const handleDurations = (time: string) => {
        const match = /^(\d{1,}):(\d{1,2}):(\d{1,2})$/.exec(time);
        if (!match) {
            setError('Invalid time format');
            return;
        }

        const [_, h, m, s] = match.map(Number);
        if (m > 60 || s > 60) {
            setError('Invalid time format');
            return;
        }

        const duration = h * 3600 + m * 60 + s;
        if (duration > 86400) {
            setError('Duration cannot be greater than 24 hours');
            return;
        }

        setValue(duration);
    };

    return (
        <Input
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
            onBlur={(e) => handleDurations(e.target.value)}
            className="text-center bg-white"
        />
    );
};

export default DurationElement;
