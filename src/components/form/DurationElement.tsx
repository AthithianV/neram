import { formatDuration } from '@/lib/time';
import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '../ui/input';

const DurationElement = ({
    value,
    onChange,
    setError,
    isSession,
    clearError,
}: {
    value?: number | null;
    onChange: (value: number) => void;
    setError: (error: string) => void;
    isSession?: boolean;
    clearError: () => void;
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
    };

    return (
        <div className="flex gap-2 items-center justify-center">
            <Clock size={16} />
            <Input
                value={fieldValue}
                onChange={(e) => {
                    setFieldValue(e.target.value);
                    clearError();
                }}
                className="h-5 px-0 text-start border-none shadow-none rounded-none"
                onBlur={(e) => handleChange(e.target.value)}
            />
        </div>
    );
};

export default DurationElement;
