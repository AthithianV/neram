import { formatDuration } from '@/lib/time';
import { useEffect, useState } from 'react';
import { Input } from '../ui/input';

const DurationElement = ({
    value,
    onChange,
    setError,
    isSession,
    clearError,
    adjustDuration,
}: {
    value?: number | null;
    onChange: (value: number) => void;
    setError: (error: string) => void;
    isSession?: boolean;
    clearError: () => void;
    adjustDuration?: () => void;
}) => {
    const [fieldValue, setFieldValue] = useState('');

    useEffect(() => {
        setFieldValue(formatDuration(value ? value : 0));
    }, [value]);

    const handleChange = (time: string) => {
        const match = /^(\d{1,}):(\d{1,2}):(\d{1,2})$/.exec(time);
        if (!match) {
            setError('Format HH:MM:SS');
            return;
        }

        const [_, h, m, s] = match.map(Number);
        if (m > 60 || s > 60) {
            setError('Format HH:MM:SS');
            return;
        }

        const duration = h * 3600 + m * 60 + s;
        if (isSession && duration > 86400) {
            setError('Duration cannot be greater than 24 hours');
            return;
        }

        onChange(duration);
        adjustDuration && adjustDuration();
    };

    return (
        <Input
            value={fieldValue}
            onChange={(e) => {
                setFieldValue(e.target.value);
                clearError();
            }}
            className="input"
            onBlur={(e) => handleChange(e.target.value)}
        />
    );
};

export default DurationElement;
