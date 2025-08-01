import { toDBTime } from '@/lib/time';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { useState } from 'react';

import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '../ui/input';

type PropsType = {
    dateValue?: string | null;
    onChange: (date: string) => void;
    setDateToTimes?: () => void;
    disable?: boolean;
};

const DatePicker = ({ dateValue, onChange, setDateToTimes, disable }: PropsType) => {
    const [open, setOpen] = useState(false);

    const handleSelect = (date: Date | undefined) => {
        date && onChange(toDBTime(date));
        setOpen(false);
        setDateToTimes && setDateToTimes();
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Input
                    className={cn(
                        '!w-45 !h-8 hover:bg-gray-100 font-semibold cursor-pointer',
                        'shadow-none',
                        open && 'border-b-2 border-sky-500',
                    )}
                    value={
                        dateValue ? dayjs(dateValue).format('DD/MM/YYYY') : 'Pick a date'
                    }
                    disabled={disable}
                />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" side="top">
                <Calendar
                    mode="single"
                    selected={dateValue ? dayjs(dateValue).toDate() : undefined}
                    onSelect={handleSelect}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
};

export default DatePicker;
