import dayjs from 'dayjs';
import { Input } from '../ui/input';
import { useEffect, useState } from 'react';

export interface TimeElementProps {
    value: Date;
    setValue: (val: Date) => void;
    setError: (error: string) => void;
}

const TimeElement = ({ value, setValue, setError }: TimeElementProps) => {
    const [time, setTime] = useState<string>(dayjs(value).format('hh:mm A'));

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTime(e.target.value);
    };

    useEffect(() => {
        setTime(dayjs(value).format('hh:mm A'));
    }, [value]);

    const handleOnBlur = () => {
        const newValue = dayjs(
            dayjs().format('YYYY-MM-DD') + ' ' + time,
            'YYYY-MM-DD hh:mm A'
        );
        if (newValue.isValid()) {
            setError('');
            setValue(newValue.toDate());
        } else {
            setError('Invalid time format');
        }
    };

    return (
        <Input
            value={time}
            onChange={handleTimeChange}
            onBlur={handleOnBlur}
            className="text-center"
        />
    );
};

export default TimeElement;
