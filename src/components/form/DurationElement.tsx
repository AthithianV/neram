import { useEffect, useState } from 'react';
import { Input } from '../ui/input';

import { secondsToTime, timeToSeconds } from '../../lib/time';

const DurationElement = ({
    value,
    setValue,
    setError,
}: {
    value: number;
    setValue: (value: number) => void;
    setError: (error: string) => void;
}) => {
    const [duration, setDuration] = useState(secondsToTime(value));

    useEffect(() => {
        setDuration(secondsToTime(value));
    }, [value]);

    const handleOnBlur = () => {
        const { isValid, duration: newDuration } = timeToSeconds(duration);
        if (isValid) {
            setValue(newDuration);
            setError('');
        } else {
            setError('Invalid time format');
        }
    };

    return (
        <Input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            onBlur={handleOnBlur}
            className="text-center"
        />
    );
};

export default DurationElement;
